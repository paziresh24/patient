import React from 'react';
import { QueryClientProvider } from 'react-query';
import { queryClient } from '../../../../common/components/layouts/provider';
import Queue from './queue';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Molecules/Queue',
  component: Queue,
};

const Template = args => (
  <div className="w-[35rem]">
    <QueryClientProvider client={queryClient}>
      <Queue {...args} />
    </QueryClientProvider>
  </div>
);

export const Simple = Template.bind({});
Simple.args = {
  bookId: '123',
};
