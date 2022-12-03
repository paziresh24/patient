/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import SelectTimeWrapper from './wrapper';

export default {
  title: 'Booking/Select Time',
  component: SelectTimeWrapper,
};

const Template = args => (
  <div className="w-[40rem]">
    <SelectTimeWrapper {...args} />
  </div>
);

export const Wrapper = Template.bind({});
Wrapper.args = {
  centerId: '8beae18d-6346-11ed-8dd2-005056ade667',
  userCenterId: 'b49c0aaf-63da-11ed-8dd2-005056ade667',
  serviceId: 'c3ec0ce3-63da-11ed-8dd2-005056ade667',
  onSubmit: id => alert(id),
};
