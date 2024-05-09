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
  const [attr, setAttr] = useState({});

  useEffect(() => {
    console.log(apiHost, clientKey);

    if (apiHost && clientKey) {
      setGrowthbook(
        new GrowthBook({
          apiHost,
          clientKey,
          enabled: true,
        }),
      );
    }
  }, [apiHost, clientKey]);

  useEffect(() => {
    growthbook?.loadFeatures?.({ autoRefresh: true });
    if (growthbook?.ready) {
      growthbook.setAttributes({
        ...previewAttributes,
      });
    }
  }, [previewAttributes, growthbook?.ready]);

  useEffect(() => {
    growthbook?.refreshFeatures?.();
    growthbook?.loadFeatures?.();
  }, [apiHost, clientKey]);

  const features = useMemo(() => {
    if (growthbook?.ready) {
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
  }, [previewAttributes, apiHost, clientKey, growthbook?.ready, attr]);

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
    [growthbook?.ready, growthbook?.setAttributes],
  );

  return (
    <GlobalActionsProvider contextName="GrowthbookGlobalContext" actions={actions}>
      <DataProvider name="Growthbook" data={features}>
        {children}
      </DataProvider>
    </GlobalActionsProvider>
  );
};
