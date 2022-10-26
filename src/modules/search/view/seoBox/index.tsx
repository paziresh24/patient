import Accordion from '@/common/components/atom/accordion';
import Breadcrumbs from '@/common/components/atom/breadcrumbs';
import { MenuItem, MenuList } from '@/common/components/atom/menu';
import Text from '@/common/components/atom/text';
import ChevronIcon from '@/common/components/icons/chevron';
import { useSearch } from '../../hooks/useSearch';

export const SearchSeoBox = () => {
  const { seoInfo, footers } = useSearch();

  return (
    <>
      <Breadcrumbs className="py-5" items={seoInfo?.breadcrumbs!} />
      <div className="flex flex-col space-y-2">
        <Text fontWeight="bold">{seoInfo?.heading}</Text>
        <Text fontSize="sm">{seoInfo?.description}</Text>
        <Accordion title="درباره این صفحه" className="!bg-white shadow-card !mt-5">
          <Text dangerouslySetInnerHTML={{ __html: seoInfo?.seo_box ?? '' }} />
        </Accordion>
        {footers?.map((item: any, index: any) => (
          <Accordion key={index} title={item.title} className="!bg-white shadow-card">
            <MenuList className="flex !flex-row flex-wrap gap-x-14">
              {item.items.map((menu: any) => (
                <MenuItem key={menu.name} name={menu.name} link={menu.url} className="flex-[1_1_25rem] !justify-start">
                  <ChevronIcon dir="left" />
                </MenuItem>
              ))}
            </MenuList>
          </Accordion>
        ))}
      </div>
    </>
  );
};

export default SearchSeoBox;
