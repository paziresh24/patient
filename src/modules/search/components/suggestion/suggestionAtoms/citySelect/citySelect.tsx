import { useGetBaseInfo } from '@/common/apis/services/config/baseInfo';
import Button from '@/common/components/atom/button';
import Modal from '@/common/components/atom/modal';
import Text from '@/common/components/atom/text';
import TextField from '@/common/components/atom/textField';
import ChevronIcon from '@/common/components/icons/chevron';
import LocationIcon from '@/common/components/icons/location';
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
  const [isOpen, setIsOpen] = useState(false);
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
    }[]
  >([]);

  useEffect(() => {
    if (getCitiesAndProvince.isSuccess) {
      provincesData.current = getCitiesAndProvince.data.data.result.province;
      citiesData.current = getCitiesAndProvince.data.data.result.city;
      setFiltredLocation(provincesData.current.map(item => ({ ...item, isProvince: true })));
    }
  }, [getCitiesAndProvince.status, isOpen]);

  const handleClickProvince = (provinceId: string) => {
    setStepSelect('cities');
    setUserSearchInput('');
    setFiltredLocation(citiesData.current.filter(city => city.province_id === provinceId).map(item => ({ ...item, isProvince: false })));
  };

  const handleClickCity = (cityId: string) => {
    onChange({
      ...citiesData.current.find(item => item.id === cityId),
      id: cityId,
      name: citiesData.current.find(item => item.id === cityId)?.name ?? 'همه ایران',
      en_slug: citiesData.current.find(item => item.id === cityId)?.en_slug ?? 'ir',
    });
    setIsOpen(false);
  };

  const handleBackToProvince = () => {
    setStepSelect('provinces');
    setFiltredLocation(provincesData.current.map(item => ({ ...item, isProvince: true })));
  };

  return (
    <>
      <Button
        variant="text"
        icon={<LocationIcon className="w-5 h-5 stroke-2 fill-slate-700 min-w-[1.25rem]" />}
        onClick={() => setIsOpen(true)}
        className="!text-slate-700 !px-3 !pr-1 whitespace-nowrap rounded-3xl rounded-tr-lg rounded-br-lg"
      >
        <Text fontSize="sm">{city.name}</Text>
      </Button>
      <Modal title="انتخاب استان/شهر" fullScreen isOpen={isOpen} onClose={setIsOpen}>
        <div className="flex flex-col h-full space-y-3">
          <div className="flex flex-wrap gap-2">
            {popularCities.map(city => (
              <Button
                key={city.id}
                onClick={() => handleClickCity(city.id)}
                variant="secondary"
                size="sm"
                className="!border-slate-300 font-medium"
              >
                {city.name}
              </Button>
            ))}
          </div>
          <TextField
            size="small"
            placeholder={`جستجو در ${stepSelect === 'provinces' ? 'استان ها' : 'شهر ها'}`}
            onChange={e => setUserSearchInput(e.target.value)}
            value={userSearchInput}
          />

          <div className="flex flex-col h-full pb-32 overflow-auto no-scroll">
            {stepSelect === 'cities' && (
              <div
                className="sticky top-0 z-10 flex items-center p-3 font-medium bg-white border-b border-solid cursor-pointer border-slate-100 hover:bg-slate-50 space-s-2 "
                onClick={handleBackToProvince}
              >
                <ChevronIcon dir="right" />
                <Text fontWeight="bold">برگشت به لیست استان‌ها</Text>
              </div>
            )}
            {filtredLocation
              .filter(item => item.name?.includes(userSearchInput))
              .map(city => (
                <div
                  key={city.id}
                  className="flex items-center justify-between p-3 font-medium border-b border-solid cursor-pointer border-slate-100 hover:bg-slate-50"
                  onClick={() => (city.isProvince ? handleClickProvince(city.id) : handleClickCity(city.id))}
                >
                  <Text>{city.name}</Text>
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
