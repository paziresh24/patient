import React from 'react';
import Rate from './rate';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'MyTurn/Rate',
  component: Rate,
};

const Template = args => (
  <div className="w-96">
    <Rate {...args} />
  </div>
);

export const Simple = Template.bind({});
Simple.args = {
  link: '#',
};
