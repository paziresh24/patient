import Button from '@/common/components/atom/button';
import Modal from '@/common/components/atom/modal';
import Text from '@/common/components/atom/text';
import useModal from '@/common/hooks/useModal';
import useWebView from '@/common/hooks/useWebView';
import { getCookie } from 'cookies-next';
import isEmpty from 'lodash/isEmpty';
import { useEffect } from 'react';
import { useSearch } from '../../hooks/useSearch';
import { useSearchRouting } from '../../hooks/useSearchRouting';
import { useSearchStore } from '../../store/search';

export const UnknownCity = () => {
  const setCity = useSearchStore(state => state.setCity);
  const { changeRoute } = useSearchRouting();
  const isWebView = useWebView();
  const city = useSearchStore(state => state.city);
  const { searchCity } = useSearch();
  const { handleOpen, handleClose, modalProps } = useModal();
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
    if (!isEmpty(currentCity) && !isEmpty(searchCity) && currentCity.en_slug !== 'ir' && searchCity?.en_slug !== currentCity?.en_slug)
      handleOpen();

    if (currentCity.en_slug == 'ir' && searchCity?.en_slug !== currentCity?.en_slug && !isEmpty(currentCity) && !isEmpty(searchCity)) {
      setCity(searchCity);
    }
  };

  return (
    <Modal noHeader {...modalProps}>
      <Text fontWeight="medium" className="leading-8">
        شما قبلاً «{city?.name}» را برای مشاهده نتایج در پذیرش24 انتخاب کردید. لطفا شهر مورد نظر خود را انتخاب کنید.
      </Text>
      <div className="flex mt-5 space-s-3">
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
            handleClose();
          }}
        >
          {city?.name}
        </Button>
        <Button
          block
          onClick={() => {
            setCity(searchCity);
            handleClose();
          }}
        >
          {searchCity?.name}
        </Button>
      </div>
    </Modal>
  );
};

export default UnknownCity;
