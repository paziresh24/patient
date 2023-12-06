/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import DiscountComponent from './discount';

export default {
  title: 'Booking/Factor',
  component: DiscountComponent,
};

const Template = args => (
  <div className="w-96">
    <DiscountComponent {...args} />
  </div>
);

export const Discount = Template.bind({});
Discount.args = {
  price: 10000,
  tax: 13200,
  totalPrice: 100000,
};
