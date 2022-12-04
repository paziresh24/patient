/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import TurnRequest from './turnRequest';

export default {
  title: 'Booking/turn request',
  component: TurnRequest,
};

const Template = args => (
  <div className="w-96">
    <TurnRequest {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  uploadRequired: true,
  uploader: true,
  ruls: [
    'زمان نوبت، جهت مراجعه شما به مطب اعلام شده و ممکن است با توجه به عمل های جراحی یا خدمات درمانی پزشک، با زمان ویزیت شما متفاوت باشد.',
    'ضروری است نوبت‌دهی صرفا با مشخصات و اطلاعات بیمار انجام شود و در صورت نیاز به دریافت نوبت برای افراد دیگر، اطلاعات نوبت را تغییر دهید.',
    "<a href='https://www.paziresh24.com/home/rules/'>شرایط کلی استفاده از خدمات پذیرش24 را می پذیرم.</a>",
  ],
};
