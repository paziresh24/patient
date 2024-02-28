import * as React from 'react';
import { PlasmicCanvasHost, registerFunction } from '@plasmicapp/react-web/lib/host';
import plasmicSplunkEvent from '@/common/services/plasmicSplunkEvent';

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
  }: {
    token: string;
    group: string;
    type: string;
    data: Record<string, any>;
  }):void`,
});
