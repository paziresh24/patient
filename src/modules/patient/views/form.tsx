/* eslint-disable react/display-name */
import Autocomplete from '@/common/components/atom/autocomplete';
import Button from '@/common/components/atom/button';
import Checkbox from '@/common/components/atom/checkbox';
import TextField from '@/common/components/atom/textField';
import cities from '@/common/constants/places/city.json';
import provinces from '@/common/constants/places/province.json';
import clsx from 'clsx';
import useTranslation from 'next-translate/useTranslation';
import { memo, useEffect } from 'react';
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

export type FormFields = Array<'NAME' | 'FAMILY' | 'NATIONAL_CODE' | 'GENDER' | 'PROVINCES' | 'CITIES' | 'CELL' | 'IS_FOREIGNER'>;

interface PatinetProfileFormProps {
  fields: FormFields;
  defaultValues?: {
    NAME?: string;
    FAMILY?: string;
    NATIONAL_CODE?: string;
    IS_FOREIGNER?: boolean;
    GENDER?: string;
    PROVINCE?: string;
    CITY?: string;
    CELL?: string;
  };
  errorsField?: object;
  onSubmit?: (data: any) => void;
  loading?: boolean;
}

const fieldsNameForError = [
  { name: 'تلفن همراه', field: 'cell' },
  {
    name: 'جنسیت',
    field: 'gender',
  },
  {
    name: 'نام',
    field: 'name',
  },
  {
    name: 'نام خانوادگی',
    field: 'family',
  },
  {
    name: 'کد ملی',
    field: 'national_code',
  },
  {
    name: 'استان',
    field: 'province',
  },
  {
    name: 'شهر',
    field: 'city',
  },
];

export const PatinetProfileForm = memo((props: PatinetProfileFormProps) => {
  const { t } = useTranslation('patient/common');
  const { fields, defaultValues, onSubmit = () => {}, loading, errorsField } = props;

  const {
    handleSubmit,
    register,
    setValue,
    control,
    watch,
    setError,
    formState: { errors },
    clearErrors,
    resetField,
  } = useForm({
    defaultValues: {
      name: defaultValues?.NAME ?? '',
      family: defaultValues?.FAMILY ?? '',
      national_code: defaultValues?.NATIONAL_CODE ?? '',
      is_foreigner: defaultValues?.IS_FOREIGNER ?? false,
      ...(defaultValues?.CELL && { cell: defaultValues?.CELL ?? '' }),
      ...(defaultValues?.GENDER && { gender: genders.find(item => item.value === defaultValues?.GENDER) }),
      ...(defaultValues?.PROVINCE && {
        province: JSON.parse(
          JSON.stringify({
            label: provinces.find(item => item.id === defaultValues?.PROVINCE)?.name,
            value: provinces.find(item => item.id === defaultValues?.PROVINCE)?.id,
          }),
        ),
      }),
      ...(defaultValues?.CITY && {
        city: JSON.parse(
          JSON.stringify({
            label: cities.find(item => item.id === defaultValues?.CITY)?.name,
            value: cities.find(item => item.id === defaultValues?.CITY)?.id,
          }),
        ),
      }),
    },
  });

  useEffect(() => {
    clearErrors();
    if (errorsField) {
      Object.entries(errorsField).map(([key, value]: [string, string]) => {
        const fieldName = fieldsNameForError.find(item => item.name === key)?.field as
          | 'cell'
          | 'gender'
          | 'name'
          | 'family'
          | 'national_code'
          | 'is_foreigner'
          | 'province'
          | 'city';
        fieldName &&
          setError(fieldName, {
            message: value,
          });
      });
    }
  }, [errorsField]);

  const provinceValue = watch('province');

  return (
    <form className="flex flex-wrap space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid w-full gap-3 md:grid-cols-2">
        {fields?.includes('NAME') && (
          <TextField
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register('name', { required: true })}
            label={t('userForm.firstName')}
          />
        )}
        {fields?.includes('FAMILY') && (
          <TextField
            error={!!errors.family}
            helperText={errors.family?.message}
            {...register('family', { required: true })}
            label={t('userForm.lastName')}
          />
        )}
        {fields?.includes('NATIONAL_CODE') && (
          <div className="flex flex-col space-y-2">
            <TextField
              error={!!errors.national_code}
              helperText={errors.national_code?.message}
              {...register('national_code', { required: !watch('is_foreigner') })}
              label={t('userForm.nationalCode')}
              disabled={watch('is_foreigner')}
              classNameWrapper={clsx({
                'opacity-40': watch('is_foreigner'),
              })}
            />
            {fields?.includes('IS_FOREIGNER') && <Checkbox label={t('userForm.foreigner')} {...register('is_foreigner')} />}
          </div>
        )}
        {fields?.includes('GENDER') && (
          <Controller
            control={control}
            name="gender"
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value, onBlur, ref }, fieldState: { error } }) => (
              <Autocomplete
                error={!!error}
                helperText={error?.message}
                classNameWrapper="flex-1"
                onChange={e => onChange(e.target.value)}
                value={value}
                label={t('userForm.gender')}
                options={genders}
                onBlur={onBlur}
              />
            )}
          />
        )}
        {fields?.includes('CELL') && (
          <TextField
            classNameWrapper="col-span-2"
            error={!!errors.cell}
            helperText={errors.cell?.message}
            {...register('cell', { required: true })}
            label={t('userForm.phoneNumber')}
          />
        )}

        {fields?.includes('PROVINCES') && (
          <Controller
            control={control}
            name="province"
            rules={{ required: true }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Autocomplete
                classNameWrapper="flex-1"
                label={t('userForm.province')}
                error={!!error}
                helperText={error?.message}
                onChange={e => {
                  resetField('city');
                  setValue('city', '');
                  onChange(e.target.value);
                }}
                value={value}
                options={formattedProvinces}
              />
            )}
          />
        )}

        {fields?.includes('CITIES') && (
          <Controller
            control={control}
            name="city"
            rules={{ required: true }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Autocomplete
                classNameWrapper="flex-1"
                label={t('userForm.city')}
                onChange={e => onChange(e.target.value)}
                value={value}
                error={!!error}
                helperText={error?.message}
                options={cities
                  .filter(city => city.province_id === provinceValue?.value)
                  .map(item => ({
                    label: item.name,
                    value: item.id,
                  }))}
              />
            )}
          />
        )}
      </div>

      <Button block type="submit" loading={loading}>
        {t('userForm.action')}
      </Button>
    </form>
  );
});
