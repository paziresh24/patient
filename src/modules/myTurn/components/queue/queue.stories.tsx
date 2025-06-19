import React from 'react';
import Queue from './queue';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Molecules/Queue',
  component: Queue,
};

const Template = args => (
  <div className="w-[35rem]">
    <Queue {...args} />
  </div>
);

export const Simple = Template.bind({});
Simple.args = {
  bookId: '123',
};
