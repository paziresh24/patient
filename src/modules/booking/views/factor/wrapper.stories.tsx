/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import Factor from './wrapper';

export default {
  title: 'Booking/Factor',
  component: Factor,
};

const Template = args => (
  <div className="w-96">
    <Factor {...args} />
  </div>
);

export const Wrapper = Template.bind({});
Wrapper.args = {
  centerId: '5532',
  bookId: 'c89aa485-7961-11ed-bd29-040300000000',
};
