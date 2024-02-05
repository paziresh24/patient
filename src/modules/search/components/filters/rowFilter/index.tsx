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
import { MouseEvent, MouseEventHandler, ReactNode, useMemo, useState } from 'react';
import AdvancedSearch from '../advancedSearch';
import RadioFilter from '../advancedSearch/sections/radio';
import MobileCategories from '../mobileCategories';
import { freeturnItems } from '../sort';

interface FilterProps {
  title: string;
  icon?: ReactNode;
  isActive?: boolean;
  removable?: boolean;
  handleClick?: MouseEventHandler;
  name: string;
  items?: FilterItems[];
}

type FilterItems = {
  title: string;
  value: string;
  count?: number;
};

const changedTitles = {
  gender: 'جنسیت',
  degree: 'میزان تخصص',
  turn_type: 'نوع خدمت',
};

export const FilterChip = (props: FilterProps) => {
  const { handleClick, removable, name, title, icon, isActive } = props;
  const { removeFilter } = useFilterChange();

  const handleRemove = (ev: MouseEvent) => {
    ev.stopPropagation();
    removeFilter(name);
  };

  return (
    <Chips
      className={`py-[6px] px-3 border !rounded-3xl flex flex-nowrap gap-1 justify-center items-center ${
        isActive ? '!text-primary border-primary bg-[#DBE5FF]' : 'text-slate-600 border-slate-200 bg-white'
      }`}
      icon={icon}
      onClick={handleClick}
    >
      <div className="flex flex-nowrap justify-center items-center gap-1">
        {title}
        {removable && (
          <button onClick={handleRemove}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M7.99967 15.1663C4.04634 15.1663 0.833008 11.953 0.833008 7.99967C0.833008 4.04634 4.04634 0.833008 7.99967 0.833008C11.953 0.833008 15.1663 4.04634 15.1663 7.99967C15.1663 11.953 11.953 15.1663 7.99967 15.1663Z"
                fill="white"
              />
              <path
                d="M7.99967 15.1663C4.04634 15.1663 0.833008 11.953 0.833008 7.99967C0.833008 4.04634 4.04634 0.833008 7.99967 0.833008C11.953 0.833008 15.1663 4.04634 15.1663 7.99967C15.1663 11.953 11.953 15.1663 7.99967 15.1663ZM7.99967 1.83301C4.59967 1.83301 1.83301 4.59967 1.83301 7.99967C1.83301 11.3997 4.59967 14.1663 7.99967 14.1663C11.3997 14.1663 14.1663 11.3997 14.1663 7.99967C14.1663 4.59967 11.3997 1.83301 7.99967 1.83301Z"
                fill="#3861FB"
              />
              <path
                d="M6.11357 10.3869C5.9869 10.3869 5.86023 10.3402 5.76023 10.2402C5.5669 10.0469 5.5669 9.7269 5.76023 9.53357L9.53357 5.76023C9.7269 5.5669 10.0469 5.5669 10.2402 5.76023C10.4336 5.95357 10.4336 6.27357 10.2402 6.4669L6.4669 10.2402C6.37357 10.3402 6.24023 10.3869 6.11357 10.3869Z"
                fill="#3861FB"
              />
              <path
                d="M9.8869 10.3869C9.76023 10.3869 9.63357 10.3402 9.53357 10.2402L5.76023 6.4669C5.5669 6.27357 5.5669 5.95357 5.76023 5.76023C5.95357 5.5669 6.27357 5.5669 6.4669 5.76023L10.2402 9.53357C10.4336 9.7269 10.4336 10.0469 10.2402 10.2402C10.1402 10.3402 10.0136 10.3869 9.8869 10.3869Z"
                fill="#3861FB"
              />
            </svg>
          </button>
        )}
      </div>
    </Chips>
  );
};

export const MobileRowFilter = () => {
  const { total, isLoading, isLanding, orderItems, selectedCategory, selectedSubCategory, filters: filterItems } = useSearch();
  const city = useSearchStore(state => state.city);
  const { handleOpen: handleOpenFiltersModal, handleClose: handleCloseFiltersModal, modalProps: filtersModalProps } = useModal();
  const { handleOpen: handleOpenSortsModal, handleClose: handleCloseSortsModal, modalProps: sortsModalProps } = useModal();
  const { handleOpen: handleOpenCategoryModal, handleClose: handleCloseCategoryModal, modalProps: categoryModalProps } = useModal();
  const { handleOpen, handleClose, modalProps } = useModal();
  const { changeRoute } = useSearchRouting();

  const { filters, handleChange: changeFilter } = useFilterChange();

  const orderItemsFormatted = useMemo(() => {
    return Object.entries(orderItems).map(([value, label]: any) => ({ title: label, value }));
  }, [orderItems]);

  const freeturnItemsFormatted = useMemo(() => {
    const items = Object.entries(freeturnItems).map(([value, label]: any) => ({ title: label, value }));
    return {
      title: 'زمان نوبت',
      name: 'freeturn',
      type: 'radio',
      items,
    };
  }, []);

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

  const [selectedFilter, setSelectedFilter] = useState<FilterProps>(freeturnItemsFormatted);

  const navFilters = useMemo(() => {
    const selectedSort = orderItemsFormatted.find(item => item.value === filters['sortBy']);
    const showFilters = [freeturnItemsFormatted, ...filterItems].filter(item => ['switch', 'radio'].includes(item.type));
    const hasFilter = showFilters.filter(item => {
      const query = filters[item.name];
      if (!query) return false;
      return (
        (item.type === 'switch' && filters[item.name] === 'true') ||
        (item.type === 'radio' && item.items.some(filterOption => filterOption.value === query))
      );
    });

    const staticFilters = [
      {
        title: hasFilter.length ? `${hasFilter.length} فیلتر` : 'فیلترها',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.168 7.90708C6.17908 7.91692 6.18954 7.92615 6.2 7.93723C6.864 8.61785 7.23015 9.51938 7.23015 10.4763V12.928L8.60615 12.1785C8.71446 12.1194 8.78154 12.0037 8.78154 11.8763V10.4689C8.78154 9.51569 9.144 8.61723 9.80185 7.94031L12.7785 4.77415C12.9711 4.56923 13.0769 4.30031 13.0769 4.01662V3.44062C13.0769 3.15508 12.8517 2.92308 12.576 2.92308H3.42462C3.14831 2.92308 2.92308 3.15508 2.92308 3.44062V4.01662C2.92308 4.30031 3.02892 4.56923 3.22154 4.77354L6.168 7.90708ZM7.01292 14.0006C6.88862 14.0006 6.76554 13.9674 6.65354 13.9009C6.43692 13.7717 6.30708 13.5434 6.30708 13.2898V10.4763C6.30708 9.77785 6.04677 9.12 5.57231 8.616C5.55815 8.60431 5.544 8.59138 5.53169 8.57785L2.54954 5.40677C2.19508 5.03015 2 4.536 2 4.01662V3.44062C2 2.64615 2.63938 2 3.42462 2H12.576C13.3606 2 14 2.64615 14 3.44062V4.01662C14 4.53538 13.8049 5.02892 13.4517 5.40615L10.4689 8.57785C9.97477 9.08738 9.70462 9.75754 9.70462 10.4689V11.8763C9.70462 12.3415 9.45292 12.7674 9.048 12.9889L7.34892 13.9145C7.24308 13.9717 7.128 14.0006 7.01292 14.0006Z"
              className={hasFilter.length ? 'fill-primary' : 'fill-slate-400'}
            />
          </svg>
        ),
        isActive: !!hasFilter.length,
        handleClick: handleOpenFiltersModal,
        name: 'filters',
      },
      {
        title: selectedSort?.title ?? 'مرتب سازی',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.79967 2.66699C5.16786 2.66699 5.46634 2.96547 5.46634 3.33366V10.5242L7.12827 8.86225C7.38862 8.6019 7.81073 8.6019 8.07108 8.86225C8.33143 9.1226 8.33143 9.54471 8.07108 9.80506L5.27108 12.6051C5.01073 12.8654 4.58862 12.8654 4.32827 12.6051L1.52827 9.80506C1.26792 9.54471 1.26792 9.1226 1.52827 8.86225C1.78862 8.6019 2.21073 8.6019 2.47108 8.86225L4.13301 10.5242V3.33366C4.13301 2.96547 4.43148 2.66699 4.79967 2.66699ZM7.06634 3.33366C7.06634 2.96547 7.36482 2.66699 7.73301 2.66699H13.333C13.7012 2.66699 13.9997 2.96547 13.9997 3.33366C13.9997 3.70185 13.7012 4.00033 13.333 4.00033H7.73301C7.36482 4.00033 7.06634 3.70185 7.06634 3.33366ZM8.66634 6.53366C8.66634 6.16547 8.96482 5.86699 9.33301 5.86699H13.333C13.7012 5.86699 13.9997 6.16547 13.9997 6.53366C13.9997 6.90185 13.7012 7.20033 13.333 7.20033H9.33301C8.96482 7.20033 8.66634 6.90185 8.66634 6.53366ZM10.6663 9.33366C10.6663 8.96547 10.9648 8.66699 11.333 8.66699H13.333C13.7012 8.66699 13.9997 8.96547 13.9997 9.33366C13.9997 9.70185 13.7012 10.0003 13.333 10.0003H11.333C10.9648 10.0003 10.6663 9.70185 10.6663 9.33366Z"
              className={selectedSort ? 'fill-primary' : 'fill-slate-400'}
            />
          </svg>
        ),
        isActive: !!selectedSort,
        handleClick: handleOpenSortsModal,
        name: 'sortBy',
      },
    ];

    const dynamicFilters = showFilters
      .map(filterOptions => {
        const { type, name, title, items } = filterOptions;
        const isActive = type === 'switch' ? filters[name] === 'true' : items.some(option => option.value === filters[name]);
        const handleClick = () => {
          if (type === 'switch' && !isActive) changeFilter(name, 'true');
          else if (type === 'radio') {
            setSelectedFilter(filterOptions);
            handleOpen();
          }
        };
        return {
          name,
          title: type === 'switch' || !isActive ? changedTitles[name] ?? title : items.find(item => item.value === filters[name])?.title,
          isActive,
          removable: isActive,
          handleClick,
        };
      })
      .sort((first, second) => +second.isActive - +first.isActive);
    return [...staticFilters, ...dynamicFilters];
  }, [filters]);

  if (isLanding) {
    return (
      <div className="p-4 border-y border-slate-200 flex w-full overflow-auto md:hidden space-s-2 no-scroll">
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
      <div className="p-4 border-y border-slate-200 flex w-full overflow-auto md:hidden space-s-2 no-scroll">
        {navFilters.map((item, index) => (
          <FilterChip
            {...item}
            key={index}
            // handleClick={}
          />
        ))}
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
      <Modal title={selectedFilter?.title} {...modalProps}>
        <RadioFilter items={selectedFilter?.items ?? []} name={selectedFilter?.name} onChange={handleClose} />
      </Modal>
    </>
  );
};

export default MobileRowFilter;
