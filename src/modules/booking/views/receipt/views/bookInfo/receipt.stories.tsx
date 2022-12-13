/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import Receipt from './bookInfo';

export default {
  title: 'Booking/Turn Receipt',
  component: Receipt,
};

const Template = args => (
  <div className="w-96">
    <Receipt {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {};
