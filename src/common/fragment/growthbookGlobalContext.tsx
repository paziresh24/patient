import React, { useEffect, useMemo, useState } from 'react';
import { DataProvider, GlobalActionsProvider } from '@plasmicapp/host';
import { isDoctorUser } from '@/common/hooks/useDoctorHomeRedirect';
import { getCookie } from 'cookies-next';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { growthbook } from 'src/pages/_app';

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
    growthbook.setAttributes({
      ...growthbook.getAttributes(),
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

  useEffect(() => {
    syncAttributes();
    if (growthbook.ready) {
      growthbook.refreshFeatures?.();
    }
    setFeaturesVersion(version => version + 1);
  }, [user, isDoctor, getDoctorSpecialties, previewAttributes, attr]);

  useEffect(() => {
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
      setAttributes: (attributes: Record<string, any>) => {
        setAttr(attributes);
        syncAttributes(attributes);
        growthbook.refreshFeatures?.();
        setFeaturesVersion(version => version + 1);
      },
      setAttributeOverrides: (attributes: Record<string, any>) => {
        setAttr(prev => ({ ...prev, ...attributes }));
        syncAttributes(attributes);
        growthbook.refreshFeatures?.();
        setFeaturesVersion(version => version + 1);
      },
    }),
    [user, isDoctor, getDoctorSpecialties, previewAttributes, attr],
  );

  const features = useMemo(() => {
    if (!growthbook.ready) return undefined;

    return Object.keys(growthbook.getFeatures()).reduce((previous, name) => {
      const feature = growthbook.getFeatures()[name];
      const isBoolean = typeof feature?.defaultValue === 'boolean';

      return {
        ...previous,
        [name]: isBoolean ? growthbook.isOn(name) : growthbook.getFeatureValue(name, undefined),
      };
    }, {});
  }, [isReady, featuresVersion, user?.id, isDoctor]);

  return (
    <GlobalActionsProvider contextName="GrowthbookGlobalContext" actions={actions}>
      <DataProvider name="Growthbook" data={{ features, isReady, attributes: growthbook.getAttributes() }}>
        {children}
      </DataProvider>
    </GlobalActionsProvider>
  );
};
