/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import SelectCenter from './selectCenter';

export default {
  title: 'Booking/Select Center',
  component: SelectCenter,
};

const Template = args => (
  <div className="w-96">
    <SelectCenter {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  id: '12',
  name: 'مطب دکتر ویدا دبیران',
  address: 'تهران - تهران - خیابان ولی عصر (عج)، بالاتر از میدان ونک، کوچه شهید والی نژاد',
  freeturn: '۲۹ شهریور - حدود ساعت 13:00',
  disable: false,
  type: 'office',
  centerNumber: ['058-2227460', '058-2241001-6'],
};
