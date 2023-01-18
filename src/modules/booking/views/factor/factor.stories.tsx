/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import Factor from './factor';

export default {
  title: 'Booking/Factor',
  component: Factor,
};

const Template = args => (
  <div className="w-96">
    <Factor {...args} />
  </div>
);

export const Details = Template.bind({});
Details.args = {
  centerId: '5532',
  bookId: 'c89aa485-7961-11ed-bd29-040300000000',
  price: 10000,
  tax: 13200,
  totalPrice: 100000,
};
