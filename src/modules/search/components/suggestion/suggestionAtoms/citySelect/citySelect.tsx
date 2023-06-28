import { useGetBaseInfo } from '@/common/apis/services/config/baseInfo';
import Button from '@/common/components/atom/button';
import Modal from '@/common/components/atom/modal';
import Text from '@/common/components/atom/text';
import TextField from '@/common/components/atom/textField';
import ChevronIcon from '@/common/components/icons/chevron';
import LocationIcon from '@/common/components/icons/location';
import SearchIcon from '@/common/components/icons/search';
import useModal from '@/common/hooks/useModal';
import classNames from '@/common/utils/classNames';
import { useEffect, useRef, useState } from 'react';
import { popularCities } from '../../../../constants/cityList/popularCities';

interface CitySelectProps {
  city: locationParam;
  onChange: (value: any) => void;
}

type locationParam = {
  name: string;
  id: string;
  province_id?: string;
  en_slug: string;
};

export const CitySelect = (props: CitySelectProps) => {
  const { city, onChange } = props;
  const { handleOpen, handleClose, modalProps } = useModal();

  const containerRef = useRef<HTMLDivElement>(null);
  const getCitiesAndProvince = useGetBaseInfo({ table: ['city', 'province'] });
  const [userSearchInput, setUserSearchInput] = useState('');
  const [stepSelect, setStepSelect] = useState<'provinces' | 'cities'>('provinces');
  const provincesData = useRef<locationParam[]>([]);
  const citiesData = useRef<locationParam[]>([]);
  const [filtredLocation, setFiltredLocation] = useState<
    {
      name: string;
      id: string;
      isProvince: boolean;
      is_capital?: '1' | '0';
    }[]
  >([]);

  useEffect(() => {
    if (getCitiesAndProvince.isSuccess) {
      provincesData.current = getCitiesAndProvince.data.data.result.province;
      citiesData.current = getCitiesAndProvince.data.data.result.city;
      setFiltredLocation(provincesData.current.map(item => ({ ...item, isProvince: true })));
    }
  }, [getCitiesAndProvince.status, modalProps.isOpen]);

  const scrollTop = () => {
    if (containerRef.current) containerRef.current.scrollTop = 0;
  };

  const handleClickProvince = (provinceId: string) => {
    setStepSelect('cities');
    setUserSearchInput('');
    scrollTop();
    setFiltredLocation(citiesData.current.filter(city => city.province_id === provinceId).map(item => ({ ...item, isProvince: false })));
  };

  const handleClickCity = (cityId: string) => {
    onChange({
      ...citiesData.current.find(item => item.id === cityId),
      id: cityId,
      name: citiesData.current.find(item => item.id === cityId)?.name ?? 'همه ایران',
      en_slug: citiesData.current.find(item => item.id === cityId)?.en_slug ?? 'ir',
    });
    handleClose();
  };

  const handleBackToProvince = () => {
    setStepSelect('provinces');
    scrollTop();
    setFiltredLocation(provincesData.current.map(item => ({ ...item, isProvince: true })));
  };

  return (
    <>
      <Button
        variant="text"
        icon={<LocationIcon className="w-5 h-5 stroke-2 fill-slate-700 min-w-[1.25rem]" />}
        onClick={handleOpen}
        className="!text-slate-700 !px-3 !pr-1 whitespace-nowrap rounded-3xl rounded-tr-lg rounded-br-lg"
      >
        <Text fontSize="sm">{city?.name}</Text>
      </Button>
      <Modal fullScreen title="انتخاب شهر" {...modalProps}>
        <div className="flex flex-col h-full space-y-3">
          <div className="flex flex-wrap gap-2">
            {popularCities.map(city => (
              <Button
                key={city.id}
                onClick={() => handleClickCity(city.id)}
                variant="secondary"
                size="sm"
                className="!border-slate-300  !text-slate-700 font-medium"
              >
                {city?.name}
              </Button>
            ))}
          </div>
          <div className="relative">
            <SearchIcon className="absolute top-[0.6rem] rtl:right-[0.6rem] ltr:left-[0.6rem] h-5 w-5" />
            <TextField
              size="small"
              placeholder={`جستجوی در شهرها`}
              onChange={e => {
                scrollTop();
                setUserSearchInput(e.target.value);
              }}
              value={userSearchInput}
              className="px-9"
            />
          </div>

          <div ref={containerRef} className="flex flex-col h-full pb-32 overflow-auto no-scroll">
            {!userSearchInput && stepSelect === 'cities' && (
              <div
                className="sticky top-0 z-10 flex items-center p-3 font-medium bg-white border-b border-solid cursor-pointer border-slate-100 hover:bg-slate-50 space-s-2 "
                onClick={handleBackToProvince}
              >
                <ChevronIcon dir="right" />
                <Text fontWeight="bold">برگشت به لیست استان‌ها</Text>
              </div>
            )}
            {userSearchInput &&
              citiesData.current
                .filter(item => item.name?.includes(userSearchInput))
                .map(city => (
                  <div
                    key={city.id}
                    className="flex items-center justify-between p-3 font-medium border-b border-solid cursor-pointer border-slate-100 hover:bg-slate-50"
                    onClick={() => handleClickCity(city.id)}
                  >
                    <div className="flex flex-col">
                      <Text>{city?.name}</Text>
                      <Text fontSize="xs" fontWeight="light">
                        {provincesData.current?.find(provine => provine.id === city.province_id)?.name}
                      </Text>
                    </div>
                    <ChevronIcon dir="left" />
                  </div>
                ))}

            {!userSearchInput &&
              filtredLocation.map(city => (
                <div
                  key={city.id}
                  className="flex items-center justify-between p-3 font-medium border-b border-solid cursor-pointer border-slate-100 hover:bg-slate-50"
                  onClick={() => (city.isProvince ? handleClickProvince(city.id) : handleClickCity(city.id))}
                >
                  <Text
                    className={classNames({
                      'font-bold': city.is_capital === '1',
                    })}
                  >
                    {city?.name}
                  </Text>
                  <ChevronIcon dir="left" />
                </div>
              ))}
          </div>
        </div>
      </Modal>
    </>
  );
};
export default CitySelect;
