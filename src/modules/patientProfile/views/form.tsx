import Autocomplete from '@/common/components/atom/autocomplete';
import Button from '@/common/components/atom/button';
import TextField from '@/common/components/atom/textField';
import cities from '@/common/constants/places/city.json';
import provinces from '@/common/constants/places/province.json';
import { useEffect } from 'react';
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

interface PatinetProfileFormProps {
  fields: Array<'NAME' | 'FAMILY' | 'NATIONAL_CODE' | 'GENDER' | 'PROVINCES' | 'CITIES' | 'CELL'>;
  defaultValues?: {
    NAME?: string;
    FAMILY?: string;
    NATIONAL_CODE?: string;
    GENDER?: string;
    PROVINCES?: string;
    CITIES?: string;
    CELL?: string;
  };
  onSubmit?: (data: any) => void;
  loading?: boolean;
}

export const PatinetProfileForm = (props: PatinetProfileFormProps) => {
  const { fields, defaultValues, onSubmit, loading } = props;
  const { handleSubmit, register, setValue, control } = useForm();

  useEffect(() => {
    if (defaultValues) {
      setValue('name', defaultValues.NAME);
      setValue('family', defaultValues.FAMILY);
      setValue('national_code', defaultValues.NATIONAL_CODE);
      setValue('cell', defaultValues.CELL);
      setValue('gender', defaultValues.GENDER);
    }
  }, [defaultValues]);

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
                  value={genders.find(item => item.value === value)}
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
          <Autocomplete
            classNameWrapper="flex-1"
            label="استان"
            options={provinces.map(item => ({ label: item.name, value: item.id }))}
            // defaultValue={provinces.find(item => item.id === userInfo.province_id)?.name}
            //   onChange={value => setDataAddress(prev => ({ ...prev, province: value.label }))}
            // value={dataAddress.province}
          />
        )}
        {fields?.includes('CITIES') && (
          <Autocomplete
            classNameWrapper="flex-1"
            label="شهر"
            options={cities.map(item => ({ label: item.name, value: item.id }))}
            // defaultValue={cities.find(item => item.id === userInfo.city_id)?.name}
            //   onChange={value => setDataAddress(prev => ({ ...prev, city: value.label }))}
            //   value={dataAddress.city}
          />
        )}
      </div>

      <Button block type="submit" loading={loading}>
        ذخیره
      </Button>
    </form>
  );
};
