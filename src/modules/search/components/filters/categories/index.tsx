import { MenuItem, MenuList } from '@/common/components/atom/menu';
import { useSearch } from '@/modules/search/hooks/useSearch';
import classNames from '@/common/utils/classNames';
import isEmpty from 'lodash/isEmpty';
import { Fragment } from 'react';

export const Categories = ({ className }: { className?: string }) => {
  const { categories, selectedCategory, selectedSubCategory } = useSearch();

  if (isEmpty(categories)) return null;
  return (
    <div className={classNames('flex-col p-5 space-y-3 bg-white rounded-lg shadow-card max-h-[24rem]', className)}>
      <MenuList className="overflow-auto scrollBar">
        {categories?.map(
          item =>
            (selectedCategory?.value === item.value || !selectedCategory?.value) && (
              <Fragment key={item.title}>
                <MenuItem
                  name={item.title}
                  link={item.url}
                  className={classNames({
                    'text-primary hidden md:flex sticky top-0 !bg-white z-10 !font-extrabold': selectedCategory?.value === item.value,
                  })}
                  shallow
                  scroll
                />
                {item.sub_categories && selectedCategory?.value === item.value && (
                  <div className="pr-3 border-r-2 border-solid border-slate-200">
                    {item.sub_categories.map(sub => (
                      <MenuItem
                        key={sub.title}
                        name={sub.title}
                        link={sub.url}
                        className={classNames({
                          'text-primary': selectedSubCategory?.value === sub.value,
                        })}
                        shallow
                        scroll
                      />
                    ))}
                  </div>
                )}
              </Fragment>
            ),
        )}
      </MenuList>
    </div>
  );
};

export default Categories;
