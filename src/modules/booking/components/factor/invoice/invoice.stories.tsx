/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import InvoiceComponent from './invoice';

export default {
  title: 'Booking/Factor',
  component: InvoiceComponent,
};

const Template = args => (
  <div className="w-96">
    <InvoiceComponent {...args} />
  </div>
);

export const Invoice = Template.bind({});
Invoice.args = {
  price: 10000,
  tax: 13200,
  discount: 13500,
  totalPrice: 100000,
};
