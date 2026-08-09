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

const shallowEqual = (a: Record<string, any>, b: Record<string, any>) => {
  const aKeys = Object.keys(a);
  if (aKeys.length !== Object.keys(b).length) return false;
  for (const key of aKeys) {
    if (!Object.is(a[key], b[key])) return false;
  }
  return true;
};

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

  useEffect(() => {
    if (!isEnabledGrowthbook) return;

    setIsReady(growthbook.ready);

    const unsubscribe = growthbook.subscribe(() => {
      setIsReady(growthbook.ready);
      setFeaturesVersion(version => version + 1);
    });

    if (!growthbook.ready) {
      growthbook.loadFeatures({ autoRefresh: true });
    }

    return () => unsubscribe?.();
  }, []);

  const actions = useMemo(
    () => ({
      // DR-08 §28: no refreshFeatures() here. It refetches the feature *definitions*, which do not
      // depend on attributes; the SDK is already created with backgroundSync + autoRefresh. This
      // action runs on every keystroke of the search box, so the refetch was pure cost.
      setAttributes: (attributes: Record<string, any>) => {
        setAttr(attributes);
        syncAttributes(attributes);
        setFeaturesVersion(version => version + 1);
      },
      setAttributeOverrides: (attributes: Record<string, any>) => {
        setAttr(prev => ({ ...prev, ...attributes }));
        syncAttributes(attributes);
        setFeaturesVersion(version => version + 1);
      },
    }),
    [user, isDoctor, getDoctorSpecialties, previewAttributes, attr],
  );

  const featuresRef = useRef<Record<string, any> | undefined>(undefined);

  // DR-08 §28: same output as before, but built with one getFeatures() call and a plain loop
  // instead of a spread-accumulating reduce (which allocated a new object per flag — ~41k property
  // copies over ~287 flags). The reference is also kept stable while no value actually changed, so
  // a keystroke that flips nothing no longer re-renders every Plasmic consumer of this provider.
  const features = useMemo(() => {
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
  }, [isReady, featuresVersion, user?.id, isDoctor]);

  const data = useMemo(
    () => ({ features, isReady, attributes: growthbook.getAttributes() }),
    [features, isReady, featuresVersion],
  );

  return (
    <GlobalActionsProvider contextName="GrowthbookGlobalContext" actions={actions}>
      <DataProvider name="Growthbook" data={data}>
        {children}
      </DataProvider>
    </GlobalActionsProvider>
  );
};
