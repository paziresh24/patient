import React, { useEffect, useMemo, useState } from 'react';
import { DataProvider, GlobalActionsProvider } from '@plasmicapp/host';
import { GrowthBook } from '@growthbook/growthbook-react';
import { getCookie } from 'cookies-next';
import { useUserInfoStore } from '@/modules/login/store/userInfo';

interface GrowthbookGlobalContextProps {
  previewAttributes?: Record<string, string>;
  apiHost: string;
  clientKey: string;
}

export const GrowthbookGlobalContext = ({
  children,
  previewAttributes,
  apiHost,
  clientKey,
}: React.PropsWithChildren<GrowthbookGlobalContextProps>) => {
  const [growthbook, setGrowthbook] = useState<any>(
    new GrowthBook({
      apiHost,
      clientKey,
      enabled: true,
      subscribeToChanges: true,
    }),
  );
  const [isReady, setIsReady] = useState(false);
  const [attr, setAttr] = useState({});
  const user = useUserInfoStore(state => state.info);

  // استخراج تخصص‌های پزشک از user
  const getDoctorSpecialties = useMemo(() => {
    if (!user?.is_doctor) {
      return [];
    }

    // Attempt to safely extract the doctor's expertise IDs, fallback to empty array if not available
    const expertises =
      user?.provider && Array.isArray((user.provider as any).expertises)
        ? (user.provider as any).expertises.map((item: any) => item?.expertise?.id).filter((id: any) => id !== undefined && id !== null)
        : [];

    return expertises;
  }, [user]);

  useEffect(() => {
    if (apiHost && clientKey) {
      setGrowthbook(
        new GrowthBook({
          apiHost,
          clientKey,
          enabled: true,
          subscribeToChanges: true,
        }),
      );
    }
  }, [apiHost, clientKey]);

  useEffect(() => {
    if (apiHost && clientKey) {
      growthbook?.refreshFeatures?.();
      growthbook?.loadFeatures?.({ autoRefresh: true });
    }
  }, [previewAttributes, apiHost, clientKey, isReady]);

  useEffect(() => {
    growthbook.setAttributes({
      ...attr,
      ...previewAttributes,
      url: window.location.href,
      id: getCookie('terminal_id'),
      user_id: user?.id,
      host: window.location.host,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      doctor_specialties: getDoctorSpecialties,
    });
  }, [attr, previewAttributes, user, getDoctorSpecialties]);

  useEffect(() => {
    setIsReady(growthbook?.ready);

    growthbook?.subscribe?.((sb: any) => {
      if (growthbook?.ready) {
        setIsReady(growthbook?.ready);
      }
    });
  }, [growthbook?.ready]);

  useEffect(() => {
    if (isReady) {
      growthbook.setAttributes({
        ...previewAttributes,
        url: window.location.href,
        id: getCookie('terminal_id'),
        user_id: user?.id,
        host: window.location.host,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        doctor_specialties: getDoctorSpecialties,
      });
    }
  }, [previewAttributes, isReady, user, getDoctorSpecialties]);

  const actions = useMemo(
    () => ({
      setAttributes: (attributes: Record<string, any>) => {
        setTimeout(() => {
          growthbook.setAttributes({
            ...attributes,
            ...previewAttributes,
            url: window.location.href,
            id: getCookie('terminal_id'),
            user_id: user?.id,
            host: window.location.host,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            doctor_specialties: getDoctorSpecialties,
          });

          setAttr(attributes);
        }, 100);
      },
      setAttributeOverrides: (attributes: Record<string, any>) => {
        setTimeout(() => {
          growthbook.setAttributes({
            ...growthbook.getAttributes(),
            ...attributes,
            ...previewAttributes,
            url: window.location.href,
            id: getCookie('terminal_id'),
            user_id: user?.id,
            host: window.location.host,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            doctor_specialties: getDoctorSpecialties,
          });

          setAttr(attributes);
        }, 100);
      },
    }),
    [isReady, growthbook, apiHost, clientKey, user, getDoctorSpecialties],
  );

  const features = useMemo(() => {
    if (isReady) {
      const getFeaturesFromGrowthbook = Object.keys(growthbook.getFeatures()).map(item => ({
        name: item,
        type: typeof growthbook.getFeatures()[item].defaultValue === 'boolean' ? 'boolean' : 'value',
      }));
      return getFeaturesFromGrowthbook.reduce((previous, current) => {
        return {
          ...previous,
          [current.name]: current.type === 'value' ? growthbook.getFeatureValue(current.name, undefined) : growthbook.isOn(current.name),
        };
      }, {});
    }
  }, [previewAttributes, apiHost, clientKey, isReady, attr, growthbook?.ready, growthbook?.getAttributes?.()]);

  return (
    <GlobalActionsProvider contextName="GrowthbookGlobalContext" actions={actions}>
      <DataProvider name="Growthbook" data={{ features, isReady, attributes: growthbook?.getAttributes() ?? {} }}>
        {children}
      </DataProvider>
    </GlobalActionsProvider>
  );
};
