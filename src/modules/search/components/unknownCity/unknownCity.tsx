import Button from '@/common/components/atom/button';
import Modal from '@/common/components/atom/modal';
import Text from '@/common/components/atom/text';
import { getCookie } from 'cookies-next';
import isEmpty from 'lodash/isEmpty';
import { useEffect, useState } from 'react';
import { useSearch } from '../../hooks/useSearch';
import { useSearchRouting } from '../../hooks/useSearchRouting';
import { useSearchStore } from '../../store/search';

export const UnknownCity = () => {
  const setCity = useSearchStore(state => state.setCity);
  const { changeRoute } = useSearchRouting();
  const city = useSearchStore(state => state.city);
  const { searchCity, selectedFilters } = useSearch();
  const [unknownCityModal, setUnknownCityModla] = useState(false);

  useEffect(() => {
    const currentCity = JSON.parse((getCookie('new-city') as string) ?? '{}');
    setUnknownCityModla(
      currentCity.en_slug !== 'ir' &&
        selectedFilters.city !== undefined &&
        !isEmpty(currentCity) &&
        selectedFilters?.city !== currentCity?.en_slug,
    );
    if (isEmpty(currentCity) && selectedFilters.city !== undefined) {
      setCity(searchCity);
    }
  }, [selectedFilters]);

  return (
    <Modal noHeader isOpen={unknownCityModal} onClose={setUnknownCityModla}>
      <Text fontWeight="medium" className="leading-8">
        شما قبلاً «{city.name}» را برای مشاهده نتایج در پذیرش24 انتخاب کردید. لطفا شهر مورد نظر خود را انتخاب کنید.
      </Text>
      <div className="flex space-s-3 mt-5">
        <Button
          block
          variant="secondary"
          onClick={() => {
            changeRoute({
              params: {
                city: city.en_slug,
              },
            });
            setCity(city);
            setUnknownCityModla(false);
          }}
        >
          {city.name}
        </Button>
        <Button
          block
          onClick={() => {
            setCity(searchCity);
            setUnknownCityModla(false);
          }}
        >
          {searchCity?.name}
        </Button>
      </div>
    </Modal>
  );
};

export default UnknownCity;
