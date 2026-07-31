import useCustomize from '@/common/hooks/useCustomize';
import { useDoctorDeviceCached } from '@/common/hooks/useDoctorDeviceCached';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useEffect, useLayoutEffect, useState } from 'react';
import { growthbook } from '@/common/growthbook/client';
import { isDoctorUser } from '../store/viewMode';
import { readTrustedEnabledLauncherFlag, writePersistedLauncherFlag } from '../utils/doctorHomeLauncherFlag';
import { shouldOptimisticallyShowNewDoctorHome } from '../utils/doctorHomeOptimisticHome';

let latched: { userId: string; enabled: boolean } | null = null;
/** Set after a user_id-safe GrowthBook resolve completes for this user. */
let safeResolvedUserId: string | null = null;
let inFlightUserId: string | null = null;
let inFlight: Promise<boolean> | null = null;

/** Memory-only during render — LS hydrate happens in useLayoutEffect. */
const ensureTrustedEnabledLatch = (userId: string): boolean =>
  latched?.userId === userId && latched.enabled === true;

const isOptimisticNewHome = (userId: string | null, deviceCached: boolean) =>
  shouldOptimisticallyShowNewDoctorHome(userId, {
    deviceCached,
    memoryEnabledTrue: !!userId && latched?.userId === userId && latched.enabled === true,
  });

/** Conclusive safe false after auth settled — may show legacy. */
const isConclusiveDisabled = (userId: string, pending: boolean) =>
  !pending &&
  safeResolvedUserId === userId &&
  latched?.userId === userId &&
  latched.enabled === false;

const persistFlagIfAllowed = (userId: string, enabled: boolean) => {
  if (enabled) {
    writePersistedLauncherFlag(userId, true);
    return;
  }
  if (!useUserInfoStore.getState().pending) {
    writePersistedLauncherFlag(userId, false);
  }
};

const readFlag = (userId: string) => {
  const enabled = growthbook.isOn('doctor-home:enable');
  if (enabled) {
    latched = { userId, enabled: true };
    safeResolvedUserId = userId;
    persistFlagIfAllowed(userId, true);
    return true;
  }

  if (useUserInfoStore.getState().pending) {
    return false;
  }

  latched = { userId, enabled: false };
  safeResolvedUserId = userId;
  persistFlagIfAllowed(userId, false);
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

    if (!growthbook.ready) {
      await growthbook.loadFeatures({ timeout: 500 });
    }

    await growthbook.refreshFeatures({ skipCache: true });

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
  const userId = user?.id;
  const customize = useCustomize(state => state.customize);
  const deviceCached = useDoctorDeviceCached();
  const [isReady, setIsReady] = useState(growthbook.ready);
  const [, setLatchEpoch] = useState(0);
  const normalizedUserId = userId != null && userId !== '' ? String(userId) : null;

  const [isResolved, setIsResolved] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  const isDoctor = !customize.partnerKey && isDoctorUser(user);
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

    if (isOptimisticNewHome(normalizedUserId, deviceCached) || ensureTrustedEnabledLatch(normalizedUserId)) {
      setIsEnabled(true);
      setIsResolved(true);
    }

    if (!canResolve) {
      return;
    }

    let cancelled = false;

    void resolveFlagForUser(normalizedUserId)
      .then(enabled => {
        if (cancelled) return;
        const stillPending = useUserInfoStore.getState().pending;
        if (!enabled && stillPending) {
          return;
        }
        setIsEnabled(enabled);
        setIsResolved(true);
      })
      .catch(error => {
        console.error('Error resolving doctor-home:enable:', error);
        if (cancelled) return;
        if (isOptimisticNewHome(normalizedUserId, deviceCached) || ensureTrustedEnabledLatch(normalizedUserId)) {
          return;
        }
        setIsResolved(true);
        setIsEnabled(false);
        safeResolvedUserId = normalizedUserId;
      });

    return () => {
      cancelled = true;
    };
  }, [canResolve, isLogin, normalizedUserId, pending, deviceCached]);

  if (customize.partnerKey) {
    return false;
  }

  if (isOptimisticNewHome(normalizedUserId, deviceCached)) {
    if (normalizedUserId && isConclusiveDisabled(normalizedUserId, pending)) {
      return false;
    }
    return true;
  }

  if (!isDoctor || !isLogin || !normalizedUserId) {
    return false;
  }

  if (isConclusiveDisabled(normalizedUserId, pending)) {
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
  const userId = user?.id;
  const customize = useCustomize(state => state.customize);
  const deviceCached = useDoctorDeviceCached();

  const isDoctor = !customize.partnerKey && isDoctorUser(user);
  const normalizedUserId = userId != null && userId !== '' ? String(userId) : null;

  if (!customize.partnerKey && isOptimisticNewHome(normalizedUserId, deviceCached)) {
    return false;
  }

  if (!isDoctor || !isLogin || !normalizedUserId) {
    return false;
  }

  if (ensureTrustedEnabledLatch(normalizedUserId)) {
    return false;
  }

  if (safeResolvedUserId === normalizedUserId) {
    return false;
  }

  return true;
};
