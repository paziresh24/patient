/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import RateWrapper from './wrapper';

export default {
  title: 'RATE/RateWrapper',
  component: RateWrapper,
};

const Template = args => (
  <div className="w-[43rem]">
    <RateWrapper {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {};
