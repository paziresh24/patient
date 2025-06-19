import Divider from '@/common/components/atom/divider';
import { MenuItem, MenuList } from '@/common/components/atom/menu';
import ChevronIcon from '@/common/components/icons/chevron';
import { Category, useSearch } from '@/modules/search/hooks/useSearch';
import classNames from '@/common/utils/classNames';
import { Fragment, useState } from 'react';

export const MobileCategories = ({ className, onClickSubCategory }: { className?: string; onClickSubCategory?: () => void }) => {
  const { categories, selectedCategory, selectedSubCategory } = useSearch();
  const [showSubCategory, setShowSubCategory] = useState<Category | undefined>(selectedCategory);

  return (
    <div className={classNames('flex-col p-5 space-y-3 bg-white rounded-lg shadow-card max-h-[24rem]', className)}>
      <MenuList className="overflow-auto scrollBar">
        {showSubCategory && (
          <MenuItem
            name="بازگشت به تخصص ها"
            icon={<ChevronIcon dir="right" />}
            className="mb-3"
            onClick={() => setShowSubCategory(undefined)}
          />
        )}

        {!showSubCategory &&
          categories?.map(item => (
            <Fragment key={item.title}>
              <MenuItem
                name={item.title}
                className={classNames({
                  'text-primary !font-extrabold': selectedCategory?.value === item.value,
                })}
                onClick={() => {
                  setShowSubCategory(item ?? []);
                }}
                shallow
              >
                <ChevronIcon dir="left" />
              </MenuItem>
              <Divider />
            </Fragment>
          ))}

        {showSubCategory && (
          <>
            <div className="pr-3 border-r-2 border-solid border-slate-200">
              {showSubCategory?.sub_categories?.map(sub => (
                <MenuItem
                  key={sub.title}
                  name={sub.title}
                  link={sub.url}
                  className={classNames({
                    'text-primary': selectedSubCategory?.value === sub.value,
                  })}
                  shallow
                  onClick={() => onClickSubCategory && onClickSubCategory()}
                />
              ))}
            </div>
            <MenuItem
              name={`همه تخصص های ${showSubCategory?.title}`}
              link={showSubCategory?.url ?? '#'}
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.25 3.5C3.5 3.5 3.5 3.708 3.5 6.25V6.275C3.5 7.382 3.5 8.182 3.771 8.52C4.036 8.848 4.823 9 6.25 9C7.677 9 8.464 8.847 8.729 8.519C9 8.182 9 7.382 9 6.274C9 3.708 9 3.5 6.25 3.5ZM6.25 10.5C4.564 10.5 3.299 10.323 2.604 9.46C2 8.711 2 7.689 2 6.275L2.75 6.25H2C2 3.38 2.181 2 6.25 2C10.319 2 10.5 3.38 10.5 6.25C10.5 7.688 10.5 8.711 9.896 9.46C9.201 10.323 7.936 10.5 6.25 10.5Z"
                    fill="currentColor"
                  ></path>{' '}
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M17.25 3.5C14.5 3.5 14.5 3.708 14.5 6.25V6.275C14.5 7.382 14.5 8.182 14.771 8.52C15.036 8.848 15.823 9 17.25 9C18.677 9 19.464 8.847 19.729 8.519C20 8.182 20 7.382 20 6.274C20 3.708 20 3.5 17.25 3.5ZM17.25 10.5C15.564 10.5 14.299 10.323 13.604 9.46C13 8.711 13 7.689 13 6.275L13.75 6.25H13C13 3.38 13.181 2 17.25 2C21.319 2 21.5 3.38 21.5 6.25C21.5 7.688 21.5 8.711 20.896 9.46C20.201 10.323 18.936 10.5 17.25 10.5Z"
                    fill="currentColor"
                  ></path>{' '}
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.25 14.5C3.5 14.5 3.5 14.708 3.5 17.25V17.275C3.5 18.382 3.5 19.182 3.771 19.52C4.036 19.848 4.823 20 6.25 20C7.677 20 8.464 19.847 8.729 19.519C9 19.182 9 18.382 9 17.274C9 14.708 9 14.5 6.25 14.5ZM6.25 21.5C4.564 21.5 3.299 21.323 2.604 20.46C2 19.711 2 18.689 2 17.275L2.75 17.25H2C2 14.38 2.181 13 6.25 13C10.319 13 10.5 14.38 10.5 17.25C10.5 18.688 10.5 19.711 9.896 20.46C9.201 21.323 7.936 21.5 6.25 21.5Z"
                    fill="currentColor"
                  ></path>{' '}
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M17.25 14.5C14.5 14.5 14.5 14.708 14.5 17.25V17.275C14.5 18.382 14.5 19.182 14.771 19.52C15.036 19.848 15.823 20 17.25 20C18.677 20 19.464 19.847 19.729 19.519C20 19.182 20 18.382 20 17.274C20 14.708 20 14.5 17.25 14.5ZM17.25 21.5C15.564 21.5 14.299 21.323 13.604 20.46C13 19.711 13 18.689 13 17.275L13.75 17.25H13C13 14.38 13.181 13 17.25 13C21.319 13 21.5 14.38 21.5 17.25C21.5 18.688 21.5 19.711 20.896 20.46C20.201 21.323 18.936 21.5 17.25 21.5Z"
                    fill="currentColor"
                  ></path>
                </svg>
              }
              className="text-primary !bg-white mt-3 !font-extrabold flex md:hidden"
              shallow
              onClick={() => onClickSubCategory && onClickSubCategory()}
            />
          </>
        )}
      </MenuList>
    </div>
  );
};

export default MobileCategories;
