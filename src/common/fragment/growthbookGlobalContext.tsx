import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
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

  useLayoutEffect(() => {
    setGrowthbook(setupGrowthbook());
  }, [apiHost, clientKey]);

  const actions = useMemo(
    () => ({
      setAttributes: (attributes: Record<string, any>) => {
        setTimeout(() => {
          growthbook.setAttributes({
            ...attributes,
            ...previewAttributes,
          });

          setAttr(attributes);
        }, 500);
      },
      setAttributeOverrides: (attributes: Record<string, any>) => {
        setTimeout(() => {
          growthbook.setAttributes({
            ...growthbook.getAttributes(),
            ...attributes,
            ...previewAttributes,
          });

          setAttr(attributes);
        }, 500);
      },
    }),
    [isReady, growthbook?.isReady],
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

  const setupGrowthbook = () => {
    if (apiHost && clientKey) {
      return new GrowthBook({
        apiHost,
        clientKey,
        enabled: true,
        subscribeToChanges: true,
      });
    }
  };

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

  return (
    <GlobalActionsProvider contextName="GrowthbookGlobalContext" actions={actions}>
      <DataProvider name="Growthbook" data={{ features, isReady, attributes: growthbook?.getAttributes() ?? {} }}>
        {children}
      </DataProvider>
    </GlobalActionsProvider>
  );
};
