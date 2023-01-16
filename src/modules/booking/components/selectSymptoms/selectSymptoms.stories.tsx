/* eslint-disable import/no-anonymous-default-export */
import React, { useState } from 'react';
import { Symptoms } from '../../types/selectSymptoms';
import SelecSymptoms from './selectSymptoms';

export default {
  title: 'Booking/Select Symptoms',
  component: SelecSymptoms,
};

export const SelecSymptomsTurn = args => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptoms[]>([]);
  const [searchText, setSearchText] = useState('');

  return (
    <>
      <div className="w-96">
        <SelecSymptoms
          {...args}
          setSelectedSymptoms={setSelectedSymptoms}
          selectedSymptoms={selectedSymptoms}
          setSearchText={setSearchText}
          searchText={searchText}
        />
      </div>
    </>
  );
};

SelecSymptomsTurn.args = {
  title: 'اضافه کردن نام بیماری',
  placeholder: 'اضافه کردن نام بیماری',
  modalTitle: 'نام بیماری',
  symptoms: [
    {
      id: 1096,
      title: 'کاشت ابرو',
      formatted_title: '<em>ک</em>اشت ابرو',
    },
    {
      id: 1097,
      title: 'کاشت مژه',
      formatted_title: '<em>ک</em>اشت مژه',
    },
    {
      id: 1098,
      title: 'کاشت مو',
      formatted_title: '<em>ک</em>اشت مو',
    },
    {
      id: 1099,
      title: 'کانال نخاعی',
      formatted_title: '<em>ک</em>انال نخاعی',
    },
    {
      id: 1100,
      title: 'کاهش بینایی',
      formatted_title: '<em>ک</em>اهش بینایی',
    },
    {
      id: 1101,
      title: 'کاهش حجم ادرار',
      formatted_title: '<em>ک</em>اهش حجم ادرار',
    },
    {
      id: 1102,
      title: 'کاهش رفلکسها',
      formatted_title: '<em>ک</em>اهش رفلکسها',
    },
    {
      id: 1103,
      title: 'کاهش هشیاری',
      formatted_title: '<em>ک</em>اهش هشیاری',
    },
    {
      id: 1104,
      title: 'کاهش وزن',
      formatted_title: '<em>ک</em>اهش وزن',
    },
    {
      id: 1105,
      title: 'کبود شدن پوست',
      formatted_title: '<em>ک</em>بود شدن پوست',
    },
  ],
};
