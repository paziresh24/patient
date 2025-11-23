import React, { useMemo } from 'react';
import { DataProvider, GlobalActionsProvider, GlobalContextMeta } from '@plasmicapp/host';
import toast, { ToastPosition } from 'react-hot-toast';
import axios from 'axios';

interface DesignSystemGlobalContextProps {
  previewApiConfig: Record<string, any>;
  apiConfig: Record<string, any>;
}

export const Fragment = ({ children, apiConfig, previewApiConfig }: React.PropsWithChildren<DesignSystemGlobalContextProps>) => {
  const actions = useMemo(
    () => ({
      showToast: (type: 'success' | 'error', message: string, placement: ToastPosition = 'top-right', duration?: number) => {
        toast[type ?? 'success'](message, {
          duration: duration,
          position: (placement.includes('left')
            ? placement.replace('left', 'right')
            : placement.includes('right')
            ? placement.replace('right', 'left')
            : placement) as ToastPosition,
        });
      },
      apiRequest: async (
        method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH' = 'GET',
        url: string,
        params: Record<string, string | string[]> = {},
        body?: Record<string, any>,
        config?: Record<string, any>,
      ) => {
        try {
          let result;
          if (method === 'GET') {
            result = await axios.get(url, {
              params,
              ...apiConfig,
              ...previewApiConfig,
              ...config,
            });
          }
          if (method === 'DELETE') {
            console.log('heelo', method, url, params, body, config);
            result = await axios.delete(url, {
              params,
              data: {
                ...body,
              },
              ...apiConfig,
              ...previewApiConfig,
              ...config,
            });
          }
          if (method !== 'GET' && method !== 'DELETE') {
            result = await axios[method.toLowerCase() as 'post' | 'put' | 'patch'](url, body, {
              params,
              ...apiConfig,
              ...previewApiConfig,
              ...config,
            });
          }
          return result;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            return error.response;
          }
        }
      },
      wait: (duration: number = 1000) => {
        return new Promise(resolve => setTimeout(resolve, duration));
      },
    }),
    [],
  );

  return (
    <GlobalActionsProvider contextName="Fragment" actions={actions}>
      <DataProvider
        name="Fragment"
        data={{
          apiConfig: apiConfig ?? {},
          previewApiConfig: previewApiConfig ?? {},
        }}
        hidden
      >
        {children}
      </DataProvider>
    </GlobalActionsProvider>
  );
};

export const fragmentMeta: GlobalContextMeta<DesignSystemGlobalContextProps> = {
  name: 'Fragment',
  displayName: 'Fragment',
  importPath: '@/common/fragment/designSystemGlobalContext',
  props: {
    apiConfig: {
      displayName: 'API Config',
      type: 'object',
      description: `e.g. { withCredentials: true }`,
      helpText: 'Read about request configuration options at https://axios-http.com/docs/req_config',
    },
    previewApiConfig: {
      displayName: 'Preview API Config',
      type: 'object',
      description: `e.g. { headers: { 'Authorization': 'XXX' } }`,
      editOnly: true,
      helpText: 'Read about request configuration options at https://axios-http.com/docs/req_config',
    },
  },
  providesData: true,
  globalActions: {
    showToast: {
      displayName: 'Show Toast',
      parameters: [
        {
          name: 'type',
          type: {
            type: 'choice',
            options: ['success', 'error'],
            defaultValueHint: 'success',
          },
        },
        {
          name: 'message',
          type: {
            type: 'string',
            defaultValueHint: 'A message for you!',
            required: true,
          },
        },
        {
          name: 'placement',
          type: {
            type: 'choice',
            options: ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'],
            defaultValueHint: 'top-right',
          },
        },
        {
          name: 'duration',
          type: {
            type: 'number',
            defaultValueHint: 3000,
          },
        },
      ],
    },
    wait: {
      displayName: 'Wait',
      parameters: [
        {
          name: 'duration',
          type: {
            type: 'number',
            defaultValueHint: 1000,
            defaultValue: 1000,
            helpText: 'executes after a specified delay (in milliseconds).',
          },
        },
      ],
    },
    apiRequest: {
      displayName: 'API Request',
      parameters: [
        {
          name: 'method',
          type: {
            type: 'choice',
            options: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
            defaultValueHint: 'GET',
            defaultValue: 'GET',
          },
        },
        {
          name: 'url',
          displayName: 'URL',
          type: {
            type: 'string',
            defaultValueHint: '/api/v1/users',
            required: true,
          },
        },
        {
          displayName: 'Query Params',
          name: 'params',
          type: {
            type: 'object',
            description: `e.g. { id: 20 }`,
            helpText: 'It will append this to the end of the URL as ?key=value.',
          },
        },
        {
          displayName: 'Body',
          name: 'body',
          type: {
            type: 'object',
            helpText: 'It is not applicable for the GET method.',
            description: `e.g. { id: 20 }`,
          },
        },
        {
          name: 'config',
          displayName: 'Request Config',
          type: {
            type: 'object',
            description: `e.g. { headers: { 'Authorization': 'XXX' } }`,
            helpText: 'Read about request configuration options at https://axios-http.com/docs/req_config',
          },
        },
      ],
    },
  },
};
