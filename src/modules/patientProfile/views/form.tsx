import Autocomplete from '@/common/components/atom/autocomplete';
import Button from '@/common/components/atom/button';
import TextField from '@/common/components/atom/textField';
import cities from '@/common/constants/places/city.json';
import provinces from '@/common/constants/places/province.json';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

const genders = [
  {
    label: 'مرد',
    value: 'male',
  },
  {
    label: 'زن',
    value: 'female',
  },
];

const formattedProvinces = provinces.map(item => ({ label: item.name, value: item.id }));

interface PatinetProfileFormProps {
  fields: Array<'NAME' | 'FAMILY' | 'NATIONAL_CODE' | 'GENDER' | 'PROVINCES' | 'CITIES' | 'CELL'>;
  defaultValues?: {
    NAME?: string;
    FAMILY?: string;
    NATIONAL_CODE?: string;
    GENDER?: string;
    PROVINCE?: string;
    CITY?: string;
    CELL?: string;
  };
  onSubmit?: (data: any) => void;
  loading?: boolean;
}

export const PatinetProfileForm = (props: PatinetProfileFormProps) => {
  const { fields, defaultValues, onSubmit = () => {}, loading } = props;
  const { handleSubmit, register, setValue, control, getValues, watch } = useForm();
  const [citiesForProvince, setCitiesForProvince] = useState([]);

  useEffect(() => {
    if (defaultValues) {
      setValue('name', defaultValues.NAME);
      setValue('family', defaultValues.FAMILY);
      setValue('national_code', defaultValues.NATIONAL_CODE);
      setValue('cell', defaultValues.CELL);
      setValue(
        'gender',
        genders.find(item => item.value === defaultValues.GENDER),
      );
      fields?.includes('PROVINCES') &&
        setValue('province', {
          label: provinces.find(item => item.id === defaultValues.PROVINCE)?.name,
          value: provinces.find(item => item.id === defaultValues.PROVINCE)?.id,
        });
      fields?.includes('CITIES') &&
        setValue('city', {
          label: cities.find(item => item.id === defaultValues.CITY)?.name,
          value: cities.find(item => item.id === defaultValues.CITY)?.id,
        });
    }
  }, [defaultValues]);

  const provinceValue = watch('province');

  return (
    <form className="flex space-y-5 flex-wrap" onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full grid md:grid-cols-2 gap-3">
        {fields?.includes('NAME') && <TextField {...register('name', { required: true })} label="نام" />}
        {fields?.includes('FAMILY') && <TextField {...register('family', { required: true })} label="نام خانوادگی" />}
        {fields?.includes('NATIONAL_CODE') && <TextField {...register('national_code', { required: true })} label="کدملی" />}
        {fields?.includes('GENDER') && (
          <Controller
            control={control}
            name="gender"
            render={({ field: { onChange, value } }) => {
              return (
                <Autocomplete
                  classNameWrapper="flex-1"
                  onChange={e => onChange(e.target.value)}
                  value={value}
                  label="جنسیت"
                  options={genders}
                />
              );
            }}
          />
        )}
        {fields?.includes('CELL') && (
          <TextField classNameWrapper="col-span-2" {...register('cell', { required: true })} label="شماره موبایل" />
        )}

        {fields?.includes('PROVINCES') && (
          <Controller
            control={control}
            name="province"
            render={({ field: { onChange, value } }) => {
              return (
                <Autocomplete
                  classNameWrapper="flex-1"
                  label="استان"
                  onChange={e => {
                    setValue('city', {});
                    onChange(e.target.value);
                  }}
                  value={value}
                  options={formattedProvinces}
                />
              );
            }}
          />
        )}

        {fields?.includes('CITIES') && (
          <Controller
            control={control}
            name="city"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => {
              return (
                <Autocomplete
                  classNameWrapper="flex-1"
                  label="شهر"
                  onChange={e => onChange(e.target.value)}
                  value={value}
                  options={cities
                    .filter(city => city.province_id === provinceValue?.value)
                    .map(item => ({
                      label: item.name,
                      value: item.id,
                    }))}
                />
              );
            }}
          />
        )}

        {/* {fields?.includes('PROVINCES') && (
          <Autocomplete
            classNameWrapper="flex-1"
            label="استان"
            options={provinces.map(item => ({ label: item.name, value: item.id }))}
            // defaultValue={provinces.find(item => item.id === userInfo.province_id)?.name}
            //   onChange={value => setDataAddress(prev => ({ ...prev, province: value.label }))}
            // value={dataAddress.province}
          />
        )} */}
        {/* {fields?.includes('CITIES') && (
          <Autocomplete
            classNameWrapper="flex-1"
            label="شهر"
            options={cities.map(item => ({ label: item.name, value: item.id }))}
            // defaultValue={cities.find(item => item.id === userInfo.city_id)?.name}
            //   onChange={value => setDataAddress(prev => ({ ...prev, city: value.label }))}
            //   value={dataAddress.city}
          />
        )} */}
      </div>

      <Button block type="submit" loading={loading}>
        ذخیره
      </Button>
    </form>
  );
};
