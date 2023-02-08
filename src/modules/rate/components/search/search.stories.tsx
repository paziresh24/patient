/* eslint-disable import/no-anonymous-default-export */
import React, { useState } from 'react';
import RateSearch from './search';

export default {
  title: 'RATE/RateSearch',
  component: RateSearch,
};

export const Default = () => {
  const [searchText, setSearchText] = useState('');
  const [searchSelect, setSearchSelect] = useState('');

  const data = [
    {
      id: 1,
      lable: null,
      placholder: '',
      value: [
        { label: 'مرتبط ترین', value: 'asra' },
        { label: 'جدید ترین', value: 'amirhossei' },
        { label: 'محبوب ترین', value: 'amirshahriar' },
      ],
      onChange: setSearchSelect,
      type: 'select',
      className: 'border border-slate-500 !py-7',
    },
    {
      id: 2,
      lable: null,
      placholder: 'جستجوی نام بیماری و ... در نظرات',
      value: null,
      onChange: setSearchText,
      type: 'search',
      className: 'border border-slate-500 !text-sm mt-4',
    },
  ];

  return (
    <>
      <div className="w-96">
        {data.map(items => (
          <RateSearch
            key={items.id}
            placholder={items.placholder}
            type={items.type}
            onchange={items.onChange}
            className={items.className}
            value={items.value}
          />
        ))}
      </div>
    </>
  );
};
