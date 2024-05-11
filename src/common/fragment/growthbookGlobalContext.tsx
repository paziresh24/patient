import React, { useEffect, useMemo, useState } from 'react';
import { DataProvider, GlobalActionsProvider } from '@plasmicapp/host';
import { GrowthBook } from '@growthbook/growthbook-react';

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
  const [growthbook, setGrowthbook] = useState<any>();
  const [isReady, setIsReady] = useState(false);
  const [attr, setAttr] = useState({});

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
      });
    }
  }, [previewAttributes, isReady]);

  useEffect(() => {
    growthbook?.refreshFeatures?.();
    growthbook?.loadFeatures?.({ autoRefresh: true });
  }, [previewAttributes, apiHost, clientKey, isReady, attr]);

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
  }, [previewAttributes, apiHost, clientKey, isReady, attr]);

  const actions = useMemo(
    () => ({
      setAttributes: (attributes: Record<string, any>) => {
        growthbook.setAttributes({
          ...attributes,
          ...previewAttributes,
        });
        setAttr(attributes);
      },
      setAttributeOverrides: (attributes: Record<string, any>) => {
        growthbook.setAttributes({
          ...growthbook.getAttributes(),
          ...attributes,
          ...previewAttributes,
        });
        setAttr(attributes);
      },
    }),
    [isReady, growthbook?.setAttributes],
  );

  return (
    <GlobalActionsProvider contextName="GrowthbookGlobalContext" actions={actions}>
      <DataProvider name="Growthbook" data={features}>
        {children}
      </DataProvider>
    </GlobalActionsProvider>
  );
};
