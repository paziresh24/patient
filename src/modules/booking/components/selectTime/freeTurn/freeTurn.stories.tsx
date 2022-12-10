/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import FreeTurnComponent from './freeTurn';

export default {
  title: 'Booking/Select Time/FreeTurn',
  component: FreeTurnComponent,
};

const Template = args => (
  <div className="w-96">
    <FreeTurnComponent {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  timeText: 'شنبه ۱۲ آذر - ساعت: ۰۸:۰۰',
};

export const WhitoutFirstFreeTurn = Template.bind({});
WhitoutFirstFreeTurn.args = {};
