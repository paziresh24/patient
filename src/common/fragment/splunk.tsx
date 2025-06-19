import React, { useMemo } from 'react';
import { GlobalActionsProvider, GlobalContextMeta } from '@plasmicapp/host';

type SplunkProps = React.PropsWithChildren<{
  defaultApiHost: string;
  defaultApiKey: string;
}>;

export const Splunk = ({ children, defaultApiHost, defaultApiKey }: SplunkProps) => {
  const actions = useMemo(
    () => ({
      sendLog: async (data: Record<string, any>, apiHost?: string, apiKey?: string) => {
        try {
          const response = await fetch(`${apiHost ?? defaultApiHost}/services/collector`, {
            method: 'POST',
            headers: {
              'Authorization': `Splunk ${apiKey ?? defaultApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              sourcetype: '_json',
              event: {
                ...data,
              },
            }),
          });
          return response.json();
        } catch (error) {
          return undefined;
        }
      },
      sendBatchLog: async (dataList: Record<string, any>[], apiHost?: string, apiKey?: string) => {
        try {
          const response = await fetch(`${apiHost ?? defaultApiHost}/services/collector`, {
            method: 'POST',
            headers: {
              'Authorization': `Splunk ${apiKey ?? defaultApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(
              dataList.map(data => ({
                sourcetype: '_json',
                event: {
                  ...data,
                },
              })),
            ),
          });
          return response.json();
        } catch (error) {
          return undefined;
        }
      },
    }),
    [defaultApiKey, defaultApiHost],
  );

  return (
    <GlobalActionsProvider contextName="Splunk" actions={actions}>
      {children}
    </GlobalActionsProvider>
  );
};

export const splunkMeta: GlobalContextMeta<SplunkProps> = {
  name: 'Splunk',
  displayName: 'Fragment/Splunk',
  props: {
    defaultApiHost: {
      type: 'string',
      displayName: 'Default API Host',
      defaultValueHint: 'https://mysplunkserver.example.com',
    },
    defaultApiKey: {
      type: 'string',
      displayName: 'Default API Key',
    },
  },
  globalActions: {
    sendLog: {
      displayName: 'Send Log',
      parameters: [
        {
          name: 'data',
          displayName: 'Data',
          type: 'object',
        },
        {
          name: 'apiHost',
          displayName: 'API Host (Optional)',
          type: 'string',
        },
        {
          name: 'apiKey',
          displayName: 'API Key (Optional)',
          type: 'string',
        },
      ],
    },
    sendBatchLog: {
      displayName: 'Send Batch Log',
      parameters: [
        {
          name: 'dataList',
          displayName: 'Data List',
          type: 'object',
        },
        {
          name: 'apiHost',
          displayName: 'API Host (Optional)',
          type: 'string',
        },
        {
          name: 'apiKey',
          displayName: 'API Key (Optional)',
          type: 'string',
        },
      ],
    },
  },
  providesData: true,
  importPath: '@/common/fragment/splunk',
};
