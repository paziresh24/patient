/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import SelectTime from './selectTime';

export default {
  title: 'Booking/Select Time',
  component: SelectTime,
};

const Template = args => (
  <div className="w-96">
    <SelectTime {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {};
