/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import SelectTime from './selectTime';

export default {
  title: 'Booking/Select Time',
  component: SelectTime,
};

const Template = args => (
  <div className="w-[40rem]">
    <SelectTime {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  centerId: '8beae18d-6346-11ed-8dd2-005056ade667',
  userCenterId: 'b49c0aaf-63da-11ed-8dd2-005056ade667',
  serviceId: 'c3ec0ce3-63da-11ed-8dd2-005056ade667',
};
