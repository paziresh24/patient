/* eslint-disable react/display-name */
import { CodeComponentMeta } from '@plasmicapp/host';
import React from 'react';
import AccordionPrimitive from '@/common/components/atom/accordion';

type AccordionType = {
  title: string;
  children?: React.ReactNode;
  className?: string;
};

export const Accordion = (props: AccordionType) => {
  const { title, children, className } = props;
  return (
    <AccordionPrimitive title={title} className={className}>
      {children}
    </AccordionPrimitive>
  );
};

export const accordionMeta: CodeComponentMeta<AccordionType> = {
  name: 'Accordion',
  displayName: 'Fragment/Accordion',
  importPath: '@/common/fragment/components/accordion',
  figmaMappings: [{ figmaComponentName: 'Accordion' }],
  props: {
    title: {
      type: 'string',
      description: 'The title of the accordion',
    },
    children: {
      type: 'slot',
    },
  },
  classNameProp: 'className',
};
