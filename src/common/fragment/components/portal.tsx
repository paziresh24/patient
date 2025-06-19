/* eslint-disable react/display-name */
import { CodeComponentMeta } from '@plasmicapp/host';
import React from 'react';
import { createPortal } from 'react-dom';

type PortalType = {
  children?: React.ReactNode;
  container?: any;
};

export const Portal = (props: PortalType) => {
  const { children, container } = props;

  if (!container) return null;
  return createPortal(children, container);
};

export const portalMeta: CodeComponentMeta<PortalType> = {
  name: 'Portal',
  displayName: 'Fragment/Portal',
  importPath: '@/common/fragment/components/portal',
  figmaMappings: [{ figmaComponentName: 'Portal' }],
  props: {
    children: {
      type: 'slot',
    },
    container: {
      type: 'code',
      lang: 'javascript',
    },
  },
};
