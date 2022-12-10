/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import RecommendCard from './recommendCard';

export default {
  title: 'Booking/Recommend Card',
  component: RecommendCard,
};

const Template = args => (
  <div className="w-96">
    <RecommendCard {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  recommendDoctors: [
    {
      id: '38291d62-ea0e-48da-aa65-8e4c544dbcc1',
      displayExpertise: 'دکترای حرفه‌ای پزشکی, دکترای تخصصی طب ایرانی (در سایت به اشتباه کارشناسی ارشد نوشته شده)',
      name: 'سیدپیمان',
      display_name: 'دکتر سیدپیمان خامه چی',
      displayAddress:
        'دانشکده طب ایرانی سلامتکده احمدیه|تهران,میدان فلسطین، خیابان طالقانی غربی، خیابان سرپرست شمالی، نبش کوچه تبریز، پلاک 27',
      freeturn: '23 آذر 8 صبح',
      url: '/dr/دکتر-سیدپیمان-خامه-چی/',
      image: '/api/getImage/p24/search-men/noimage.png?size=150',
      medicalCode: '166296',
      experience: null,
      star: 4.7,
      ratesCount: 68,
      isBulk: false,
    },
    {
      id: '1671',
      displayExpertise: 'دکترای تخصصی (Ph.D) طب سنتی ایرانی, طب سنتی ایرانی',
      name: 'الهام',
      displayName: 'دکتر الهام زارعی',
      displayAddress: 'تهران,تهران، خیابان حافظ خیابان نوفل لوشاتو خیابان خارک سلامتکده طب سنتی خارک',
      freeturn: '28 آذر 9 صبح',
      url: '/dr/دکتر-الهام-زارعی-3/',
      image: '/api/getImage/p24/search-women/054435b28be89eb52d84760230ebc8e1.jpg?size=150',
      medicalCode: '103624',
      experience: null,
      star: 4.9,
      ratesCount: 115,
      isBulk: false,
    },
  ],
};
