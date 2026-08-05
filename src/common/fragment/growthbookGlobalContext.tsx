import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DataProvider, GlobalActionsProvider } from '@plasmicapp/host';
import { isDoctorUser } from '@/common/hooks/useDoctorHomeRedirect';
import { getCookie } from 'cookies-next';
import getConfig from 'next/config';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { growthbook } from 'src/pages/_app';

const { publicRuntimeConfig } = getConfig();
const isEnabledGrowthbook =
  !!publicRuntimeConfig.GROWTHBOOK_API_HOST &&
  !!publicRuntimeConfig.GROWTHBOOK_CLIENT_KEY;

/**
 * DR-08 §۲۸.۹ — kill-switchِ حالتِ «خواندنِ زنده».
 *
 * وقتی خاموش است، رفتار **دقیقاً** همان چیزی است که امروز روی production تأیید شده (snapshot).
 * وقتی روشن است، `features`/`attributes` به‌جای عکسِ لحظه‌ای، **در لحظه‌ی خواندن** از SDK
 * می‌آیند ⇒ هویتشان ثابت می‌ماند و تایپ در کادرِ جستجو دیگر کلِ درختِ Plasmic را رندر نمی‌کند.
 *
 * عمداً از خودِ GrowthBook خوانده می‌شود (نه env) تا خاموش‌کردنش **بدونِ deploy** ممکن باشد.
 * نبودِ فلگ در GrowthBook ⇒ `isOn` مقدارِ false می‌دهد ⇒ رفتارِ امروز. یعنی merge به‌تنهایی
 * هیچ‌چیز را عوض نمی‌کند؛ روشن‌کردن یک تصمیمِ جدا و برگشت‌پذیر است.
 */
export const LIVE_FEATURES_FLAG = 'gb-context-live-features';

/** فاصله‌ی coalesce کردنِ رندر بعد از یک رگبارِ تغییرِ attribute (تایپ). */
const RENDER_COALESCE_MS = 300;

const shallowEqual = (a: Record<string, any>, b: Record<string, any>) => {
  const aKeys = Object.keys(a);
  if (aKeys.length !== Object.keys(b).length) return false;
  for (const key of aKeys) {
    if (!Object.is(a[key], b[key])) return false;
  }
  return true;
};

const resolveFeature = (gb: any, name: string) => {
  const definition = gb.getFeatures()[name];
  if (!definition) return undefined;
  return typeof definition.defaultValue === 'boolean' ? gb.isOn(name) : gb.getFeatureValue(name, undefined);
};

/**
 * آبجکتی که **در لحظه‌ی خواندن** مقدارِ فلگ را از SDK می‌گیرد، به‌جای اینکه عکسِ لحظه‌ای باشد.
 *
 * چرا Proxy و نه یک آبجکتِ ساده: مصرف‌کننده‌ها دو جور می‌خوانند — ۲۷ جا با ایندکس
 * (`features["x"]`) و چند جای `launcher` با `Object.entries(features)`. هر دو باید کار کنند،
 * پس علاوه بر `get` باید `ownKeys`/`getOwnPropertyDescriptor`/`has` هم پیاده شوند؛ وگرنه
 * صفحاتِ launcher **بی‌صدا خالی** می‌شوند.
 */
export function createLiveFeatures(gb: any): Record<string, any> {
  // eslint-disable-next-line no-undef -- envِ eslintِ این repo هنوز globalهای ES2015 را نمی‌شناسد
  return new Proxy(
    {},
    {
      get: (_target, prop) => (typeof prop === 'string' ? resolveFeature(gb, prop) : undefined),
      has: (_target, prop) => typeof prop === 'string' && prop in gb.getFeatures(),
      ownKeys: () => Object.keys(gb.getFeatures()),
      getOwnPropertyDescriptor: (_target, prop) => {
        if (typeof prop !== 'string' || !(prop in gb.getFeatures())) return undefined;
        // `configurable: true` الزامی است: کلید روی خودِ targetِ خالی وجود ندارد و بدونِ آن
        // موتور invariantِ Proxy را می‌شکند و `Object.entries` throw می‌کند.
        return { value: resolveFeature(gb, prop), enumerable: true, configurable: true, writable: false };
      },
    },
  );
}

/**
 * همان آبجکتی که به `DataProvider` می‌رود — ولی `attributes` و `isReady` **getter**اند.
 * نتیجه: هویتِ آبجکت ثابت می‌ماند (⇒ درختِ Plasmic رندر نمی‌شود) ولی هر خواندن تازه است.
 */
export function createLiveData(gb: any, features: Record<string, any>) {
  return {
    features,
    get isReady() {
      return gb.ready;
    },
    get attributes() {
      return gb.getAttributes();
    },
  };
}

interface GrowthbookGlobalContextProps {
  previewAttributes?: Record<string, string>;
  apiHost: string;
  clientKey: string;
}

export const GrowthbookGlobalContext = ({
  children,
  previewAttributes,
}: React.PropsWithChildren<GrowthbookGlobalContextProps>) => {
  const [isReady, setIsReady] = useState(growthbook.ready);
  const [featuresVersion, setFeaturesVersion] = useState(0);
  const [attr, setAttr] = useState({});
  const user = useUserInfoStore(state => state.info);

  const isDoctor = isDoctorUser(user);

  const getDoctorSpecialties = useMemo(() => {
    if (!isDoctor) return [];

    const expertises =
      user?.provider && Array.isArray((user.provider as any).expertises)
        ? (user.provider as any).expertises.map((item: any) => item?.expertise?.id).filter((id: any) => id != null)
        : [];

    return expertises;
  }, [isDoctor, user]);

  const syncAttributes = (extra: Record<string, unknown> = {}) => {
    const currentAttributes = growthbook.getAttributes();
    growthbook.setAttributes({
      ...currentAttributes,
      ...attr,
      ...previewAttributes,
      ...extra,
      url: window.location.href,
      id: getCookie('terminal_id'),
      user_id: user?.id,
      is_doctor: isDoctor,
      slug: user?.provider?.slug,
      host: window.location.host,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      doctor_specialties: getDoctorSpecialties,
    });
  };

  // DR-08 §28: `attr` deliberately kept out of the deps. It only ever changes through the
  // setAttributes/setAttributeOverrides actions below, which already sync synchronously —
  // keeping it here made every keystroke in the search box run this effect a second time
  // (a full re-sync + a refreshFeatures() network call over ~287 flags).
  useEffect(() => {
    syncAttributes();
    setFeaturesVersion(version => version + 1);
  }, [user, isDoctor, getDoctorSpecialties, previewAttributes]);

  // DR-08 §۲۸.۹ — حالتِ «خواندنِ زنده» فقط وقتی روشن است که فلگش در GrowthBook روشن باشد.
  // نبودِ فلگ ⇒ false ⇒ رفتارِ امروز. (kill-switch بدونِ deploy.)
  const liveMode =
    isEnabledGrowthbook && typeof (growthbook as any).isOn === 'function' && growthbook.isOn(LIVE_FEATURES_FLAG);

  const coalesceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bumpNow = () => setFeaturesVersion(version => version + 1);
  // در حالتِ زنده، رگبارِ تایپ نباید هر حرف یک رندر بسازد؛ صحتِ خواندن‌ها را getterها تضمین
  // می‌کنند، پس رندر فقط برای هم‌گام‌کردنِ UIِ فلگ‌محور لازم است و می‌تواند coalesce شود.
  const bumpCoalescedRef = useRef<() => void>(() => undefined);
  bumpCoalescedRef.current = () => {
    if (!liveMode) return bumpNow();
    if (coalesceRef.current) clearTimeout(coalesceRef.current);
    coalesceRef.current = setTimeout(() => {
      coalesceRef.current = null;
      bumpNow();
    }, RENDER_COALESCE_MS);
  };

  useEffect(() => {
    if (!isEnabledGrowthbook) return;

    setIsReady(growthbook.ready);

    // تغییرِ واقعیِ مجموعه‌ی فلگ‌ها (لود/رفرش) نادر است ⇒ بدونِ تأخیر رندر شود.
    const unsubscribe = growthbook.subscribe(() => {
      setIsReady(growthbook.ready);
      setFeaturesVersion(version => version + 1);
    });

    if (!growthbook.ready) {
      growthbook.loadFeatures({ autoRefresh: true });
    }

    return () => {
      unsubscribe?.();
      if (coalesceRef.current) clearTimeout(coalesceRef.current);
    };
  }, []);

  // هویتِ `actions` عمداً ثابت است: قبلاً با هر کلیدفشار عوض می‌شد و هر مصرف‌کننده‌ی
  // GlobalActions را هم بی‌دلیل رندر می‌کرد. رفتار عوض نمی‌شود چون بدنه‌ها از طریقِ ref
  // همیشه آخرین نسخه‌ی syncAttributes را صدا می‌زنند.
  const syncRef = useRef(syncAttributes);
  syncRef.current = syncAttributes;

  const actions = useMemo(
    () => ({
      // DR-08 §28: no refreshFeatures() here. It refetches the feature *definitions*, which do not
      // depend on attributes; the SDK is already created with backgroundSync + autoRefresh. This
      // action runs on every keystroke of the search box, so the refetch was pure cost.
      setAttributes: (attributes: Record<string, any>) => {
        setAttr(attributes);
        syncRef.current(attributes);
        bumpCoalescedRef.current();
      },
      setAttributeOverrides: (attributes: Record<string, any>) => {
        setAttr(prev => ({ ...prev, ...attributes }));
        syncRef.current(attributes);
        bumpCoalescedRef.current();
      },
    }),
    [],
  );

  const featuresRef = useRef<Record<string, any> | undefined>(undefined);

  // DR-08 §28: same output as before, but built with one getFeatures() call and a plain loop
  // instead of a spread-accumulating reduce (which allocated a new object per flag — ~41k property
  // copies over ~287 flags). The reference is also kept stable while no value actually changed, so
  // a keystroke that flips nothing no longer re-renders every Plasmic consumer of this provider.
  const features = useMemo(() => {
    if (liveMode) return undefined; // در حالتِ زنده اصلاً snapshot ساخته نمی‌شود
    if (!growthbook.ready) return undefined;

    const definitions = growthbook.getFeatures();
    const next: Record<string, any> = {};

    for (const name of Object.keys(definitions)) {
      const isBoolean = typeof definitions[name]?.defaultValue === 'boolean';
      next[name] = isBoolean ? growthbook.isOn(name) : growthbook.getFeatureValue(name, undefined);
    }

    const previous = featuresRef.current;
    if (previous && shallowEqual(previous, next)) return previous;

    featuresRef.current = next;
    return next;
  }, [liveMode, isReady, featuresVersion, user?.id, isDoctor]);

  // Proxy یک بار ساخته می‌شود و تا پایانِ عمرِ provider همان می‌ماند.
  const liveFeaturesRef = useRef<Record<string, any> | null>(null);
  if (liveMode && !liveFeaturesRef.current) liveFeaturesRef.current = createLiveFeatures(growthbook);

  const data = useMemo(
    () =>
      liveMode
        ? createLiveData(growthbook, liveFeaturesRef.current as Record<string, any>)
        : { features, isReady, attributes: growthbook.getAttributes() },
    [liveMode, features, isReady, featuresVersion],
  );

  return (
    <GlobalActionsProvider contextName="GrowthbookGlobalContext" actions={actions}>
      <DataProvider name="Growthbook" data={data}>
        {children}
      </DataProvider>
    </GlobalActionsProvider>
  );
};
