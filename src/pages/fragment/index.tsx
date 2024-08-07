import * as React from 'react';
import { PlasmicCanvasHost, registerFunction, registerGlobalContext } from '@plasmicapp/react-web/lib/host';
import plasmicSplunkEvent from '@/common/services/plasmicSplunkEvent';
import { AuthGlobalContext } from '@/common/fragment/authGlobalContext';
import { Fragment } from '@/common/fragment/designSystemGlobalContext';
import { GrowthbookGlobalContext } from '@/common/fragment/growthbookGlobalContext';

export default function PlasmicHost() {
  return <PlasmicCanvasHost />;
}

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
    api_host
  }: {
    token: string;
    group: string;
    type: string;
    data: Record<string, any>;
    api_host?: string;
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

registerGlobalContext(GrowthbookGlobalContext, {
  name: 'GrowthbookGlobalContext',
  displayName: 'GrowthBook',
  props: {
    apiHost: {
      type: 'string',
      displayName: 'Api Host',
      defaultValueHint: 'https://cdn.growthbook.io',
    },
    clientKey: {
      type: 'string',
      displayName: 'Client Key',
      defaultValueHint: 'sdk-XXX',
    },
    previewAttributes: {
      type: 'object',
      editOnly: true,
      displayName: 'Preview Attributes',
      description: 'Simulate how your rules will apply to users.',
    },
  },
  globalActions: {
    setAttributes: {
      displayName: 'Set Attributes',
      parameters: [
        {
          name: 'attributes',
          type: 'object',
        },
      ],
    },
    setAttributeOverrides: {
      displayName: 'Set Attribute Overrides',
      parameters: [
        {
          name: 'attributes',
          type: 'object',
        },
      ],
    },
  },
  providesData: true,
  importPath: '@/common/fragment/growthbookGlobalContext',
});
