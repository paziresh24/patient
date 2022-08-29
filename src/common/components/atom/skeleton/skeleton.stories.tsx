import React from 'react';
import Skeleton from './skeleton';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Atoms/Skeleton',
  component: Skeleton,
};

const Template = args => <Skeleton {...args} />;

export const ExampleStory = Template.bind({});
ExampleStory.args = {};
