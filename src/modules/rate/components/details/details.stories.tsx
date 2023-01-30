/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import Details from './details';

export default {
  title: 'RATE/Details',
  component: Details,
};

const Template = args => (
  <div className="w-96">
    <Details {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  satisfaction: 97,
  title: 'رضایت',
  count: 7300,
  count_text: 'نظر',
  information: [
    { id: 1, title: 'رضایت پزشک', satisfaction: 40, avg_star: 4.6 },
    { id: 2, title: 'توضیح پزشک در هنگام ویزیت', satisfaction: 50, avg_star: 3.9 },
    { id: 3, title: 'مهارت و تخصص پزشک', satisfaction: 80, avg_star: 4.4 },
  ],
};
