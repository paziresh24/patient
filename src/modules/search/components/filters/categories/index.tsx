import { MenuItem, MenuList } from '@/common/components/atom/menu';
import { useSearch } from '@/modules/search/hooks/useSearch';
import clsx from 'clsx';
import { Fragment } from 'react';

export const Categories = ({ className }: { className?: string }) => {
  const { categories, selectedCategory, selectedSubCategory } = useSearch();

  return (
    <div className={clsx('flex-col p-5 space-y-3 bg-white rounded-lg shadow-card max-h-[24rem]', className)}>
      <MenuList className="overflow-auto scrollBar">
        {categories?.map(
          item =>
            (selectedCategory?.value === item.value || !selectedCategory?.value) && (
              <Fragment key={item.title}>
                <MenuItem
                  name={item.title}
                  link={item.url}
                  className={clsx({
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
                        className={clsx({
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
