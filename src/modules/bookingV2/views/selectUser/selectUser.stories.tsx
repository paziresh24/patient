/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import SelectUser from './selectUser';

export default {
  title: 'Booking/Select User',
  component: SelectUser,
};

const Template = args => (
  <div className="w-96">
    <SelectUser {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {};
