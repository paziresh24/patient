import * as React from 'react';
import { PlasmicCanvasHost, registerFunction, registerGlobalContext } from '@plasmicapp/react-web/lib/host';
import plasmicSplunkEvent from '@/common/services/plasmicSplunkEvent';
import { AuthGlobalContext } from '@/common/fragment/authGlobalContext';
import { Fragment } from '@/common/fragment/designSystemGlobalContext';

registerFunction(plasmicSplunkEvent, {
  name: 'splunkEvent',
  isDefaultExport: true,
  importPath: '@/common/services/plasmicSplunkEvent',
  description: 'splunk event',
  typescriptDeclaration: `({
    token,
    group,
    type,
    data,
  }: {
    token: string;
    group: string;
    type: string;
    data: Record<string, any>;
  }):void`,
});

registerGlobalContext(AuthGlobalContext, {
  name: 'AuthGlobalContext',
  displayName: 'Paziresh24 Auth',
  props: {
    previewToken: {
      type: 'string',
      editOnly: true,
    },
  },
  providesData: true,
  globalActions: {
    login: { parameters: [] },
    logout: { parameters: [] },
  },
  importPath: '@/common/fragment/authGlobalContext',
});

registerGlobalContext(Fragment, {
  name: 'Fragment',
  props: {},
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
  },
  importPath: '@/common/fragment/designSystemGlobalContext',
});

export default function PlasmicHost() {
  return <PlasmicCanvasHost />;
}
