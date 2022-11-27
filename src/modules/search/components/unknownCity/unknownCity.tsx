import Button from '@/common/components/atom/button';
import Modal from '@/common/components/atom/modal';
import Text from '@/common/components/atom/text';
import useWebView from '@/common/hooks/useWebView';
import { getCookie } from 'cookies-next';
import isEmpty from 'lodash/isEmpty';
import { useEffect, useState } from 'react';
import { useSearch } from '../../hooks/useSearch';
import { useSearchRouting } from '../../hooks/useSearchRouting';
import { useSearchStore } from '../../store/search';

export const UnknownCity = () => {
  const setCity = useSearchStore(state => state.setCity);
  const { changeRoute } = useSearchRouting();
  const isWebView = useWebView();
  const city = useSearchStore(state => state.city);
  const { searchCity } = useSearch();
  const [unknownCityModal, setUnknownCityModal] = useState(false);
  const currentCity = getCookie('new-city') ? JSON.parse((getCookie('new-city') as string) ?? '{}') : {};

  useEffect(() => {
    !isWebView && handleCheckUserCity();
    if (!isWebView && isEmpty(currentCity) && searchCity) {
      setCity(searchCity);
    }
    if (isWebView && searchCity) {
      setCity(searchCity);
    }
  }, [searchCity]);

  const handleCheckUserCity = () => {
    setUnknownCityModal(
      !isEmpty(currentCity) && !isEmpty(searchCity) && currentCity.en_slug !== 'ir' && searchCity.en_slug !== currentCity?.en_slug,
    );
  };

  return (
    <Modal noHeader isOpen={unknownCityModal} onClose={setUnknownCityModal}>
      <Text fontWeight="medium" className="leading-8">
        شما قبلاً «{city?.name}» را برای مشاهده نتایج در پذیرش24 انتخاب کردید. لطفا شهر مورد نظر خود را انتخاب کنید.
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
            setUnknownCityModal(false);
          }}
        >
          {city?.name}
        </Button>
        <Button
          block
          onClick={() => {
            setCity(searchCity);
            setUnknownCityModal(false);
          }}
        >
          {searchCity?.name}
        </Button>
      </div>
    </Modal>
  );
};

export default UnknownCity;
