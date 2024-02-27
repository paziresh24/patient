import * as React from 'react';
import { PlasmicCanvasHost, registerFunction } from '@plasmicapp/react-web/lib/host';
import { splunkInstanceForPlasmic } from '@/common/services/splunk';

export default function PlasmicHost() {
  return <PlasmicCanvasHost />;
}

registerFunction(splunkInstanceForPlasmic, {
  name: 'splunkEvent',
  importPath: './common/services/splunk',
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
