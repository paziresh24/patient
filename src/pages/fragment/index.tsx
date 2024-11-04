import * as React from 'react';
import { PlasmicCanvasHost, registerFunction, registerGlobalContext, registerComponent } from '@plasmicapp/react-web/lib/host';
import plasmicSplunkEvent from '@/common/services/plasmicSplunkEvent';
import { AuthGlobalContext } from '@/common/fragment/authGlobalContext';
import { Fragment, fragmentMeta } from '@/common/fragment/designSystemGlobalContext';
import { GrowthbookGlobalContext } from '@/common/fragment/growthbookGlobalContext';
import { ApiRequest, apiRequestMeta } from '@/common/fragment/components/api-request';
import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import { Splunk, splunkMeta } from '@/common/fragment/splunk';
import { Switch, switchMeta } from '@/common/fragment/components/switch';
import { fragmentPWAMeta, PWA } from '@/common/fragment/pwa';

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

registerGlobalContext(Fragment, fragmentMeta);

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

registerGlobalContext(Splunk, splunkMeta);

registerComponent(ApiRequest as any, apiRequestMeta);
registerComponent(Switch as any, switchMeta);
registerGlobalContext(PWA, fragmentPWAMeta);

registerComponent(LayoutWithHeaderAndFooter, {
  name: 'LayoutWithHeaderAndFooter',
  importPath: '@/common/components/layouts/layoutWithHeaderAndFooter',
  displayName: 'Paziresh24/LayoutWithHeaderAndFooter',
  props: {
    children: {
      type: 'slot',
    },
    shouldShowBrand: {
      type: 'boolean',
      defaultValue: true,
    },
    shouldShowPromoteApp: {
      type: 'boolean',
      defaultValue: true,
    },
    showBottomNavigation: {
      type: 'boolean',
      defaultValue: true,
    },
    showHeader: {
      type: 'boolean',
      defaultValue: true,
    },
    showFooter: {
      type: 'boolean',
      defaultValue: true,
    },
    compactFooter: {
      type: 'boolean',
      defaultValue: false,
    },
    showSearchSuggestionButton: {
      type: 'boolean',
      defaultValue: false,
    },
  },
  classNameProp: 'className',
  defaultStyles: {
    width: 'stretch',
  },
});
