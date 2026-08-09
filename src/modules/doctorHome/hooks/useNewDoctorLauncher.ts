import useCustomize from '@/common/hooks/useCustomize';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useEffect, useState } from 'react';
import { growthbook } from 'src/pages/_app';
import { isDoctorUser } from '../store/viewMode';

let latched: { userId: string; enabled: boolean } | null = null;
let inFlightUserId: string | null = null;
let inFlight: Promise<boolean> | null = null;

const readFlag = (userId: string) => {
  const enabled = growthbook.isOn('doctor-home:enable');
  latched = { userId, enabled };
  return enabled;
};

const resolveFlagForUser = async (userId: string) => {
  if (latched?.userId === userId) {
    return latched.enabled;
  }

  if (inFlight && inFlightUserId === userId) {
    return inFlight;
  }

  inFlightUserId = userId;
  inFlight = (async () => {
    const attributes = growthbook.getAttributes();
    const currentUserId = attributes.user_id != null ? String(attributes.user_id) : null;

    if (currentUserId !== userId) {
      growthbook.setAttributes({
        ...attributes,
        user_id: userId,
        loggedIn: true,
        is_doctor: true,
      });
    }

    if (!growthbook.ready) {
      await growthbook.loadFeatures({ timeout: 500 });
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
  const [isReady, setIsReady] = useState(growthbook.ready);
  const [isResolved, setIsResolved] = useState(() => {
    const id = userId != null && userId !== '' ? String(userId) : null;
    return !!id && latched?.userId === id;
  });
  const [isEnabled, setIsEnabled] = useState(() => {
    const id = userId != null && userId !== '' ? String(userId) : null;
    return !!id && latched?.userId === id ? latched.enabled : false;
  });

  const isDoctor = !customize.partnerKey && isDoctorUser(user);
  const normalizedUserId = userId != null && userId !== '' ? String(userId) : null;
  const canResolve = isLogin && normalizedUserId != null && !pending && isReady;

  useEffect(() => {
    const unsubscribe = growthbook.subscribe(() => {
      setIsReady(growthbook.ready);
    });

    return () => unsubscribe?.();
  }, []);

  useEffect(() => {
    if (!isLogin || !normalizedUserId) {
      latched = null;
      setIsResolved(false);
      setIsEnabled(false);
      return;
    }

    if (latched?.userId === normalizedUserId) {
      setIsEnabled(latched.enabled);
      setIsResolved(true);
      return;
    }

    if (!canResolve) {
      setIsResolved(false);
      return;
    }

    let cancelled = false;

    void resolveFlagForUser(normalizedUserId).then(enabled => {
      if (cancelled) return;
      setIsEnabled(enabled);
      setIsResolved(true);
    });

    return () => {
      cancelled = true;
    };
  }, [canResolve, isLogin, normalizedUserId]);

  if (!isDoctor || !isLogin || !normalizedUserId) {
    return false;
  }

  if (latched?.userId === normalizedUserId) {
    return latched.enabled;
  }

  return isResolved && isEnabled;
};

export const useIsNewDoctorLauncherLoading = () => {
  const user = useUserInfoStore(state => state.info);
  const isLogin = useUserInfoStore(state => state.isLogin);
  const pending = useUserInfoStore(state => state.pending);
  const userId = user?.id;
  const customize = useCustomize(state => state.customize);
  const [isReady, setIsReady] = useState(growthbook.ready);

  const isDoctor = !customize.partnerKey && isDoctorUser(user);
  const normalizedUserId = userId != null && userId !== '' ? String(userId) : null;
  const hasLatchedForUser = latched?.userId === normalizedUserId;

  useEffect(() => {
    const unsubscribe = growthbook.subscribe(() => {
      setIsReady(growthbook.ready);
    });

    return () => unsubscribe?.();
  }, []);

  return isDoctor && isLogin && !!normalizedUserId && (pending || !isReady || !hasLatchedForUser);
};
