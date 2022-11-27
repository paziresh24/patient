/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import SelectCenter from './selectCenter';

export default {
  title: 'Booking/Select Center',
  component: SelectCenter,
};

const Template = args => (
  <div className="w-96">
    <SelectCenter {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {};
