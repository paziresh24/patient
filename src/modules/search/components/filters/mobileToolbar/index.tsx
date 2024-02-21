import Button from '@/common/components/atom/button';
import Chips from '@/common/components/atom/chips';
import Divider from '@/common/components/atom/divider';
import Modal from '@/common/components/atom/modal';
import Text from '@/common/components/atom/text';
import useModal from '@/common/hooks/useModal';
import { useFilterChange } from '@/modules/search/hooks/useFilterChange';
import { useSearch } from '@/modules/search/hooks/useSearch';
import { useSearchRouting } from '@/modules/search/hooks/useSearchRouting';
import { useSearchStore } from '@/modules/search/store/search';
import { addCommas } from '@persian-tools/persian-tools';
import { useMemo } from 'react';
import AdvancedSearch from '../advancedSearch';
import RadioFilter from '../advancedSearch/sections/radio';
import MobileCategories from '../mobileCategories';
import { freeturnItems } from '../sort';

export const MobileToolbar = () => {
  const { total, isLoading, isLanding, orderItems, selectedCategory, selectedSubCategory } = useSearch();
  const city = useSearchStore(state => state.city);
  const { handleOpen: handleOpenFiltersModal, handleClose: handleCloseFiltersModal, modalProps: filtersModalProps } = useModal();
  const { handleOpen: handleOpenSortsModal, handleClose: handleCloseSortsModal, modalProps: sortsModalProps } = useModal();
  const { handleOpen: handleOpenFreeturnModal, handleClose: handleCloseFreeturnModal, modalProps: freeturnModalProps } = useModal();
  const { handleOpen: handleOpenCategoryModal, handleClose: handleCloseCategoryModal, modalProps: categoryModalProps } = useModal();
  const { changeRoute } = useSearchRouting();

  const { filters } = useFilterChange();

  const orderItemsFormatted = useMemo(() => {
    return Object.entries(orderItems).map(([value, label]: any) => ({ title: label, value }));
  }, [orderItems]);

  const freeturnItemsFormatted = useMemo(() => {
    return Object.entries(freeturnItems).map(([value, label]: any) => ({ title: label, value }));
  }, [orderItems]);

  const handleRemoveAllFilters = () => {
    changeRoute({ previousQueries: false });
    handleCloseFiltersModal();
  };

  const suggestionTags = () => {
    if (!city) return [];

    const cityName = city.en_slug === 'ir' ? 'ایران' : city.name;
    return [
      {
        text: `پزشکان متخصص ${cityName}`,
        onClick: () =>
          changeRoute({
            params: {
              ...(city.en_slug === 'ir' && { city: 'ir' }),
              category: 'doctor',
            },
            previousQueries: false,
          }),
      },
      {
        text: `بیمارستان های ${cityName}`,
        onClick: () =>
          changeRoute({
            params: {
              ...(city.en_slug === 'ir' && { city: 'ir' }),
              category: 'center',
            },
            previousQueries: false,
          }),
      },
    ];
  };

  if (isLanding) {
    return (
      <div className="flex w-full overflow-auto md:hidden space-s-3 no-scroll p-4 border-y border-slate-200">
        {suggestionTags().map((chip, index) => (
          <Chips key={index} className="py-2 !rounded-md !text-black flex justify-center items-center" {...chip}>
            {chip.text}
          </Chips>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex w-full overflow-auto md:hidden space-s-3 no-scroll p-4 border-y border-slate-200">
        <Chips
          className="py-2 !rounded-md !text-black flex justify-center items-center"
          icon={
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              data-v-9e94fcae=""
              data-v-1d0c34d2=""
              className=""
              data-v-6bcd5181=""
            >
              <title data-v-9e94fcae="">icon</title>{' '}
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.39256 2.25C6.41294 2.25 6.43338 2.25 6.4539 2.25H17.5465L17.6079 2.25C18.5135 2.24996 19.2762 2.24992 19.8421 2.33146C20.4028 2.41226 21.0685 2.61224 21.3698 3.2831C21.671 3.95396 21.3783 4.58436 21.0661 5.05714C20.7511 5.53425 20.2444 6.10427 19.6427 6.78115L19.6019 6.827L16.2079 10.6453C15.5568 11.3777 15.3133 11.6585 15.1445 11.9693C15.0053 12.2255 14.9012 12.4992 14.835 12.7831C14.7547 13.1276 14.7502 13.4993 14.7502 14.4792V19C14.7502 20.5188 13.519 21.75 12.0002 21.75C10.4814 21.75 9.25021 20.5188 9.25021 19V14.4792C9.25021 13.4993 9.24568 13.1276 9.16539 12.7831C9.09922 12.4992 8.99514 12.2255 8.85597 11.9693C8.68711 11.6585 8.44358 11.3777 7.79256 10.6453L4.39852 6.827C4.38489 6.81167 4.37131 6.79639 4.35777 6.78116C3.75604 6.10428 3.24931 5.53425 2.9343 5.05714C2.62216 4.58436 2.32938 3.95396 2.63063 3.2831C2.93189 2.61224 3.59757 2.41226 4.15831 2.33146C4.72419 2.24992 5.48689 2.24996 6.39256 2.25ZM3.97616 3.92838C3.97547 3.92811 3.97804 3.9249 3.98597 3.91953C3.98083 3.92596 3.97686 3.92864 3.97616 3.92838ZM4.01371 3.90419C4.06214 3.88121 4.16591 3.84586 4.37224 3.81613C4.8179 3.75191 5.47051 3.75 6.4539 3.75H17.5465C18.5299 3.75 19.1825 3.75191 19.6282 3.81613C19.8345 3.84586 19.9383 3.88121 19.9867 3.90419C19.9717 3.95566 19.9292 4.05671 19.8143 4.23067C19.5663 4.60642 19.1341 5.09546 18.4808 5.83046L15.0867 9.64875C15.0665 9.67147 15.0466 9.69391 15.0269 9.71608C14.4558 10.3583 14.0877 10.7723 13.8264 11.2532C13.623 11.6276 13.4709 12.0277 13.3742 12.4427C13.25 12.9757 13.2501 13.5297 13.2502 14.3891C13.2502 14.4188 13.2502 14.4488 13.2502 14.4792V19C13.2502 19.6904 12.6906 20.25 12.0002 20.25C11.3099 20.25 10.7502 19.6904 10.7502 19V14.4792C10.7502 14.4488 10.7502 14.4188 10.7502 14.3891C10.7504 13.5297 10.7505 12.9757 10.6262 12.4427C10.5295 12.0277 10.3774 11.6276 10.174 11.2532C9.91275 10.7723 9.5446 10.3583 8.97354 9.71608C8.95383 9.69392 8.93388 9.67147 8.91368 9.64875L5.51964 5.83046C4.86631 5.09546 4.43417 4.60642 4.18608 4.23067C4.07122 4.0567 4.02871 3.95566 4.01371 3.90419ZM20.0243 3.92838C20.0236 3.92864 20.0196 3.92596 20.0145 3.91954C20.0224 3.9249 20.025 3.92811 20.0243 3.92838ZM19.9937 3.87327C19.9923 3.86516 19.9929 3.86041 19.9936 3.86007C19.9942 3.85972 19.9949 3.86378 19.9937 3.87327ZM4.00674 3.87327C4.00548 3.86378 4.00618 3.85972 4.00684 3.86007C4.00751 3.86041 4.00814 3.86516 4.00674 3.87327Z"
                fill="currentColor"
                data-v-9e94fcae=""
              ></path>
            </svg>
          }
          onClick={handleOpenFiltersModal}
        >
          جستجوی پیشرفته
        </Chips>
        <Chips
          className="py-2 !rounded-md !text-black flex justify-center items-center"
          icon={
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              data-v-552d4a1c=""
              data-v-1d0c34d2=""
              className=""
              data-v-6bcd5181=""
            >
              <title data-v-552d4a1c="">icon</title>{' '}
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17 2.25C15.4812 2.25 14.25 3.48122 14.25 5V6.75V9C14.25 9.41421 14.5858 9.75 15 9.75C15.4142 9.75 15.75 9.41421 15.75 9V7.5H18.25V9C18.25 9.41421 18.5858 9.75 19 9.75C19.4142 9.75 19.75 9.41421 19.75 9V6.75V5C19.75 3.48122 18.5188 2.25 17 2.25ZM18.25 5V6H15.75V5C15.75 4.30964 16.3096 3.75 17 3.75C17.6904 3.75 18.25 4.30964 18.25 5ZM7 5.25C7.41421 5.25 7.75 5.58579 7.75 6V16.1893L9.46967 14.4697C9.76256 14.1768 10.2374 14.1768 10.5303 14.4697C10.8232 14.7626 10.8232 15.2374 10.5303 15.5303L7.53033 18.5303C7.23744 18.8232 6.76256 18.8232 6.46967 18.5303L3.46967 15.5303C3.17678 15.2374 3.17678 14.7626 3.46967 14.4697C3.76256 14.1768 4.23744 14.1768 4.53033 14.4697L6.25 16.1893V6C6.25 5.58579 6.58579 5.25 7 5.25ZM14.25 13C14.25 12.5858 14.5858 12.25 15 12.25H19C19.2766 12.25 19.5307 12.4022 19.6613 12.6461C19.7918 12.89 19.7775 13.1859 19.624 13.416L16.4014 18.25H19C19.4142 18.25 19.75 18.5858 19.75 19C19.75 19.4142 19.4142 19.75 19 19.75H15C14.7234 19.75 14.4693 19.5978 14.3387 19.3539C14.2082 19.11 14.2225 18.8141 14.376 18.584L17.5986 13.75H15C14.5858 13.75 14.25 13.4142 14.25 13Z"
                fill="currentColor"
                data-v-552d4a1c=""
              ></path>
            </svg>
          }
          onClick={handleOpenSortsModal}
        >
          مرتب سازی:{' '}
          {orderItemsFormatted.find(item => item.value === filters['sortBy'])?.title ??
            orderItemsFormatted.find(item => item.value === 'clinic')?.title}
        </Chips>
        <Chips
          className="py-2 !rounded-md !text-black flex justify-center items-center"
          icon={
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              data-v-a5e1de1a=""
              data-v-1d0c34d2=""
              className=""
              data-v-6bcd5181=""
            >
              <title data-v-a5e1de1a="">icon</title>{' '}
              <path
                d="M20 10V7C20 5.89543 19.1046 5 18 5H6C4.89543 5 4 5.89543 4 7V19C4 20.1046 4.89543 21 6 21H9M15 3V7M9 3V7M4 11H9M16 15.2V16.8875L16.9 17.9M20.5 17C20.5 19.4853 18.4853 21.5 16 21.5C13.5147 21.5 11.5 19.4853 11.5 17C11.5 14.5147 13.5147 12.5 16 12.5C18.4853 12.5 20.5 14.5147 20.5 17Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                data-v-a5e1de1a=""
              ></path>
            </svg>
          }
          onClick={handleOpenFreeturnModal}
        >
          نزدیک ترین نوبت:{' '}
          {freeturnItemsFormatted.find(item => item.value === filters['freeturn'])?.title ??
            freeturnItemsFormatted.find(item => item.value === 'all')?.title}
        </Chips>
      </div>
      <Modal fullScreen title="فیلترها" {...filtersModalProps}>
        <div className="space-y-3 pb-36">
          <div className="flex justify-between" onClick={handleOpenCategoryModal}>
            <Text fontSize="sm" fontWeight="bold">
              تخصص ها
            </Text>
            <Text fontSize="sm" className="w-40 text-left line-clamp-1">
              {selectedSubCategory?.title ?? selectedCategory?.title ?? 'انتخاب کنید'}
            </Text>
          </div>
          <Divider />
          <AdvancedSearch className="!p-0 !shadow-none" />
          <div className="fixed bottom-0 right-0 flex w-full p-4 bg-white border-t md:static border-slate-200 space-s-3">
            <Button block loading={isLoading} onClick={handleCloseFiltersModal}>
              مشاهده {addCommas(total)} نتیجه
            </Button>
            <Button block variant="secondary" onClick={handleRemoveAllFilters}>
              حذف تمام فیلترها
            </Button>
          </div>
        </div>
      </Modal>
      <Modal title={selectedSubCategory?.title ?? selectedCategory?.title ?? 'انتخاب تخصص'} {...categoryModalProps} fullScreen>
        <div className="pb-36">
          <MobileCategories className="!max-h-full shadow-none !p-0" onClickSubCategory={handleCloseCategoryModal} />
        </div>
      </Modal>
      <Modal title="مرتب سازی" {...sortsModalProps}>
        <RadioFilter items={orderItemsFormatted} name="sortBy" onChange={handleCloseSortsModal} />
      </Modal>
      <Modal title="نزدیک ترین نوبت" {...freeturnModalProps}>
        <RadioFilter items={freeturnItemsFormatted} name="freeturn" onChange={handleCloseFreeturnModal} />
      </Modal>
    </>
  );
};

export default MobileToolbar;
