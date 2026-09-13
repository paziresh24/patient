import useCustomize from '@/common/hooks/useCustomize';
import { useDoctorDeviceCached } from '@/common/hooks/useDoctorDeviceCached';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useEffect, useLayoutEffect, useState } from 'react';
import { growthbook } from '@/common/growthbook/client';
import { hasDoctorIdentity } from '@/common/utils/doctorIdentity';
import { readTrustedEnabledLauncherFlag, writePersistedLauncherFlag } from '../utils/doctorHomeLauncherFlag';
import { shouldOptimisticallyShowNewDoctorHome } from '../utils/doctorHomeOptimisticHome';

let latched: { userId: string; enabled: boolean } | null = null;
/** Set after a user_id-safe GrowthBook resolve completes for this user. */
let safeResolvedUserId: string | null = null;
let inFlightUserId: string | null = null;
let inFlight: Promise<boolean> | null = null;

const isAuthBusy = () => {
  const state = useUserInfoStore.getState();
  return state.pending || state.doctorProfilePending;
};

/** Memory-only during render — LS hydrate happens in useLayoutEffect. */
const ensureTrustedEnabledLatch = (userId: string): boolean =>
  latched?.userId === userId && latched.enabled === true;

const hydrateTrustedLatch = (userId: string) => {
  if (latched?.userId === userId && latched.enabled === true) return true;
  if (readTrustedEnabledLauncherFlag(userId) === true) {
    latched = { userId, enabled: true };
    return true;
  }
  return latched?.userId === userId && latched.enabled === true;
};

const isOptimisticNewHome = (userId: string | null) => {
  if (!userId) return false;
  const persistedEnabledTrue = readTrustedEnabledLauncherFlag(userId) === true;
  return shouldOptimisticallyShowNewDoctorHome(userId, {
    memoryEnabledTrue: hydrateTrustedLatch(userId),
    persistedEnabledTrue,
  });
};

/** Conclusive safe false after auth settled — may show legacy. */
const isConclusiveDisabled = (userId: string) =>
  !isAuthBusy() &&
  safeResolvedUserId === userId &&
  latched?.userId === userId &&
  latched.enabled === false;

const persistEnabledFlag = (userId: string) => {
  writePersistedLauncherFlag(userId, true);
};

const readFlag = (userId: string) => {
  const enabled = growthbook.isOn('doctor-home:enable');
  if (enabled) {
    latched = { userId, enabled: true };
    safeResolvedUserId = userId;
    persistEnabledFlag(userId);
    return true;
  }

  if (isAuthBusy()) {
    return false;
  }

  latched = { userId, enabled: false };
  safeResolvedUserId = userId;
  return false;
};

const assertGrowthbookUserId = (userId: string) => {
  const current = growthbook.getAttributes().user_id;
  return current != null && String(current) === String(userId);
};

const resolveFlagForUser = async (userId: string) => {
  if (inFlight && inFlightUserId === userId) {
    return inFlight;
  }

  inFlightUserId = userId;
  inFlight = (async () => {
    const applyUserAttributes = () => {
      growthbook.setAttributes({
        ...growthbook.getAttributes(),
        user_id: userId,
        loggedIn: true,
        is_doctor: true,
      });
    };

    applyUserAttributes();

    const trustedCache = readTrustedEnabledLauncherFlag(userId) === true;
    if (!growthbook.ready) {
      await growthbook.loadFeatures({ timeout: trustedCache ? 150 : 500 });
    }

    await growthbook.refreshFeatures({ skipCache: !trustedCache });

    if (!assertGrowthbookUserId(userId)) {
      applyUserAttributes();
      await growthbook.refreshFeatures({ skipCache: true });
    }

    if (!assertGrowthbookUserId(userId)) {
      throw new Error('GrowthBook user_id mismatch before doctor-home:enable evaluation');
    }

    return readFlag(userId);
  })().finally(() => {
    if (inFlightUserId === userId) {
      inFlight = null;
      inFlightUserId = null;
    }
  });

  return inFlight;
};

export const useIsNewDoctorLauncherEnabled = () => {
  const user = useUserInfoStore(state => state.info);
  const isLogin = useUserInfoStore(state => state.isLogin);
  const pending = useUserInfoStore(state => state.pending);
  const doctorProfilePending = useUserInfoStore(state => state.doctorProfilePending);
  const userId = user?.id;
  const customize = useCustomize(state => state.customize);
  const deviceCached = useDoctorDeviceCached();
  const [isReady, setIsReady] = useState(growthbook.ready);
  const [, setLatchEpoch] = useState(0);
  const normalizedUserId = userId != null && userId !== '' ? String(userId) : null;

  const [isResolved, setIsResolved] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  const isDoctor = !customize.partnerKey && hasDoctorIdentity(user, deviceCached);
  const canResolve = isLogin && normalizedUserId != null && isReady;

  // Hydrate trusted flag from LS before paint (not during render).
  useLayoutEffect(() => {
    if (!normalizedUserId) return;
    if (readTrustedEnabledLauncherFlag(normalizedUserId) === true) {
      latched = { userId: normalizedUserId, enabled: true };
      setLatchEpoch(n => n + 1);
      setIsEnabled(true);
      setIsResolved(true);
    }
  }, [normalizedUserId]);

  useEffect(() => {
    const unsubscribe = growthbook.subscribe(() => {
      setIsReady(growthbook.ready);
    });

    return () => unsubscribe?.();
  }, []);

  useEffect(() => {
    if (!isLogin || !normalizedUserId) {
      if (!deviceCached) {
        latched = null;
        safeResolvedUserId = null;
        setIsResolved(false);
        setIsEnabled(false);
      }
      return;
    }

    if (isOptimisticNewHome(normalizedUserId) || ensureTrustedEnabledLatch(normalizedUserId)) {
      setIsEnabled(true);
      setIsResolved(true);
    }

    if (!canResolve) {
      return;
    }

    let cancelled = false;

    const applyResolved = (enabled: boolean) => {
      if (cancelled) return;
      if (!enabled) {
        if (isAuthBusy()) return;
        if (!(latched?.userId === normalizedUserId && latched.enabled === false)) {
          void resolveFlagForUser(normalizedUserId).then(applyResolved).catch(onResolveError);
          return;
        }
      }
      setIsEnabled(enabled);
      setIsResolved(true);
    };

    const onResolveError = (error: unknown) => {
      console.error('Error resolving doctor-home:enable:', error);
      if (cancelled) return;
      if (isOptimisticNewHome(normalizedUserId) || ensureTrustedEnabledLatch(normalizedUserId)) {
        return;
      }
    };

    void resolveFlagForUser(normalizedUserId).then(applyResolved).catch(onResolveError);

    return () => {
      cancelled = true;
    };
  }, [canResolve, isLogin, normalizedUserId, pending, doctorProfilePending, deviceCached]);

  if (customize.partnerKey) {
    return false;
  }

  if (isOptimisticNewHome(normalizedUserId)) {
    if (normalizedUserId && isConclusiveDisabled(normalizedUserId)) {
      return false;
    }
    return true;
  }

  if (!isDoctor || !isLogin || !normalizedUserId) {
    return false;
  }

  if (isConclusiveDisabled(normalizedUserId)) {
    return false;
  }

  if (ensureTrustedEnabledLatch(normalizedUserId)) {
    return true;
  }

  if (safeResolvedUserId === normalizedUserId && latched?.userId === normalizedUserId) {
    return latched.enabled;
  }

  return isResolved && isEnabled;
};

export const useIsNewDoctorLauncherLoading = () => {
  const user = useUserInfoStore(state => state.info);
  const isLogin = useUserInfoStore(state => state.isLogin);
  useUserInfoStore(state => state.pending);
  useUserInfoStore(state => state.doctorProfilePending);
  const userId = user?.id;
  const customize = useCustomize(state => state.customize);
  const deviceCached = useDoctorDeviceCached();

  const isDoctor = !customize.partnerKey && hasDoctorIdentity(user, deviceCached);
  const normalizedUserId = userId != null && userId !== '' ? String(userId) : null;

  if (!customize.partnerKey && isOptimisticNewHome(normalizedUserId)) {
    return false;
  }

  if (normalizedUserId && ensureTrustedEnabledLatch(normalizedUserId)) {
    return false;
  }

  if (normalizedUserId && isConclusiveDisabled(normalizedUserId)) {
    return false;
  }

  const shouldHoldDoctorLauncher = deviceCached || (isDoctor && isLogin && normalizedUserId != null);
  if (!customize.partnerKey && shouldHoldDoctorLauncher) {
    return true;
  }

  return false;
};
