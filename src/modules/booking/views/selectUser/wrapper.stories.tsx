/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import SelectUserWrapper from './wrapper';

export default {
  title: 'Booking/Select User',
  component: SelectUserWrapper,
};

const Template = args => (
  <div className="w-96">
    <SelectUserWrapper {...args} />
  </div>
);

export const Wrapper = Template.bind({});
Wrapper.args = {
  onSubmit: info => alert(JSON.stringify(info)),
};
