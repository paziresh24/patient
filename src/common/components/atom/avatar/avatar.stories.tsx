import React from 'react';
import Avatar from './avatar';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Atoms/Avatar',
  component: Avatar,
};

const Template = args => <Avatar {...args} />;

export const Simple = Template.bind({});
Simple.args = {
  src: 'https://i.pravatar.cc/150?img=50',
  width: 70,
  height: 70,
};
