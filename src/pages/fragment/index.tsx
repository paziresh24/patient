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
import { PWA, fragmentPWAMeta } from '@/common/fragment/pwa';
import { RadioFilter, radioFilterMeta } from '@/common/fragment/components/radioFilter';
import { Portal, portalMeta } from '@/common/fragment/components/portal';
import { Accordion, accordionMeta } from '@/common/fragment/components/accordion';
import { Gallery, galleryMeta } from '@/common/fragment/components/gallery';
import { Popover, popoverMeta } from '@/common/fragment/components/popover';
import FactorWrapper from '@/modules/booking/views/factor/wrapper';
import DoctorInvoiceNotice from '@/modules/booking/components/factor/doctorInvoiceNotice';
import { AppFrame } from '@/modules/hamdast/appFrame';

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
registerComponent(RadioFilter as any, radioFilterMeta);
registerComponent(Gallery as any, galleryMeta);
registerGlobalContext(PWA, fragmentPWAMeta);
registerComponent(Portal, portalMeta);
registerComponent(Accordion, accordionMeta);
registerComponent(Popover, popoverMeta);
registerComponent(FactorWrapper, {
  name: 'Factor',
  displayName: 'Paziresh24/Factor',
  importPath: '@/modules/booking/views/factor/wrapper',
  figmaMappings: [{ figmaComponentName: 'Factor' }],
  props: {
    bookId: 'string',
    userCenterId: 'string',
    serviceId: 'string',
    centerId: 'string',
  },
});
registerComponent(DoctorInvoiceNotice, {
  name: 'DoctorInvoiceNotice',
  displayName: 'Paziresh24/DoctorInvoiceNotice',
  importPath: '@/modules/booking/components/factor/doctorInvoiceNotice',
  figmaMappings: [{ figmaComponentName: 'DoctorInvoiceNotice' }],
  props: {
    slug: 'string',
    serviceId: 'string',
  },
});
registerComponent(AppFrame, {
  name: 'AppFrame',
  displayName: 'Hamdast/AppFrame',
  importPath: '@/modules/hamdast/appFrame',
  figmaMappings: [{ figmaComponentName: 'AppFrame' }],
  props: {
    appKey: 'string',
    params: {
      type: 'array',
    },
    queries: {
      type: 'array',
    },
  },
});

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
