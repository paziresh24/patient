/* eslint-disable react/display-name */
import { CodeComponentMeta } from '@plasmicapp/host';
import React from 'react';
import SwitchPrimitive from '@/common/components/atom/switch';

type SwitchType = {
  onCheckedChange?: (checked: boolean) => void;
  checked?: any;
  disabled?: boolean;
  className?: string;
  name?: string;
};

export const Switch = (props: SwitchType) => {
  const { checked, onCheckedChange, disabled, className, name } = props;
  return (
    <SwitchPrimitive
      checked={checked}
      onChange={e => onCheckedChange?.(e.target.checked)}
      className={className}
      disabled={disabled}
      name={name}
    />
  );
};

export const switchMeta: CodeComponentMeta<SwitchType> = {
  name: 'Switch',
  displayName: 'Fragment/Switch',
  importPath: '@/common/fragment/components/switch',
  figmaMappings: [{ figmaComponentName: 'Switch' }],
  props: {
    checked: 'boolean',
    disabled: 'boolean',
    name: {
      type: 'string',
      advanced: true,
      description: 'The HTML name of the switch',
    },
    onCheckedChange: {
      type: 'eventHandler',
      argTypes: [{ name: 'checked', type: 'boolean' }],
    },
  },
  classNameProp: 'className',
  states: {
    checked: {
      type: 'writable',
      variableType: 'text',
      valueProp: 'checked',
      onChangeProp: 'onCheckedChange',
    },
  },
};
