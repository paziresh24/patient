import React from 'react';
import { QueryClientProvider } from 'react-query';
import { queryClient } from '../../../../common/components/layouts/provider';
import Turn from './turn';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  title: 'Organisms/Turn',
  component: Turn,
};

const Template = args => (
  <QueryClientProvider client={queryClient}>
    <div className="w-96">
      <Turn {...args} />
    </div>
  </QueryClientProvider>
);

export const Active = Template.bind({});
Active.args = {
  status: 'not_visited',
  doctorInfo: {
    avatar: 'https://www.paziresh24.com/api/getImage/p24/search-men/d418ce9cfb1df336bad5b3c48bc03f1e.jpg',
    firstName: 'دکتر امیرحسین',
    lastName: 'بیگی',
    expertise: 'پزشک عمومی',
  },
  turnDetails: {
    bookTime: 1644812367,
    waitingTime: 2,
    trackingCode: '1235',
  },
  centerInfo: {
    centerId: '5532',
    centerType: '3',
    hasPaging: false,
  },
  patientInfo: {
    nationalCode: '4421141224',
  },
  prescription: {
    pdf: '123',
  },
  location: {
    address: 'آدرس: یزد، میدان مهدیه، بلوار آیت الله طالقانی، ساختمان نظام پزشکی طبقه دوم، واحد 21',
    lat: 31.885828,
    lng: 54.348932,
  },
  feedbackUrl: 'http://p4z.ir/6uon7c8',
};
