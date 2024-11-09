/* eslint-disable react/display-name */
import { CodeComponentMeta } from '@plasmicapp/host';
import React, { useState } from 'react';
import Text from '@/common/components/atom/text';
import { addCommas } from '@persian-tools/persian-tools';
import classNames from '@/common/utils/classNames';

type RadioFilterType = {
  items: any[];
  name: string;
  title?: string;
  onChange?: (value: any) => void;
  value?: string;
  className?: string;
};

export const RadioFilter = (props: RadioFilterType) => {
  const { items, name, onChange, value, className } = props;
  return (
    <>
      {items?.map(item => (
        <label key={item.label} className={classNames('flex items-center cursor-pointer space-s-2', className)}>
          <input
            checked={value === item.value}
            type="radio"
            name={name}
            onChange={e => {
              onChange && onChange(item.value);
            }}
          />
          <Text>{item.label}</Text>
          {item.count && (
            <Text fontSize="xs" className="decoration-dotted underline opacity-50">
              {addCommas(item.count ?? 0)}
            </Text>
          )}
        </label>
      ))}
    </>
  );
};

export const radioFilterMeta: CodeComponentMeta<RadioFilterType> = {
  name: 'RadioFilter',
  displayName: 'Paizresh24/RadioFilter',
  importPath: '@/common/fragment/components/radioFilter',
  figmaMappings: [{ figmaComponentName: 'RadioFilter' }],
  props: {
    items: {
      type: 'array',
      itemType: {
        type: 'object',
        nameFunc(item) {
          return item?.value;
        },
        fields: {
          label: 'string',
          value: 'string',
          count: {
            type: 'number',
            required: false,
          },
        },
      },
    },
    title: 'string',
    name: {
      type: 'string',
      advanced: true,
      description: 'The HTML name of the switch',
    },
    value: 'string',
    onChange: {
      type: 'eventHandler',
      argTypes: [{ name: 'selected', type: 'string' }],
    },
  },
  classNameProp: 'className',

  states: {
    selected: {
      type: 'writable',
      variableType: 'text',
      valueProp: 'value',
      onChangeProp: 'onChange',
    },
  },
};
