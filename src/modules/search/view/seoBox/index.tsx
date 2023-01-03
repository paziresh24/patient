import Accordion from '@/common/components/atom/accordion';
import Breadcrumbs from '@/common/components/atom/breadcrumbs';
import { MenuItem, MenuList } from '@/common/components/atom/menu';
import Text from '@/common/components/atom/text';
import ChevronIcon from '@/common/components/icons/chevron';
import useCustomize from '@/common/hooks/useCustomize';
import { useSearch } from '../../hooks/useSearch';

export const SearchSeoBox = () => {
  const customize = useCustomize(state => state.customize);
  const { seoInfo, footers } = useSearch();

  return (
    <>
      <Breadcrumbs className="py-5" items={seoInfo?.breadcrumbs!} />
      {customize.showSeoBoxs && (
        <div className="flex flex-col !mt-5 space-y-2">
          <Text as="h1" fontWeight="bold">
            {seoInfo?.heading}
          </Text>
          <Text as="p" fontSize="sm">
            {seoInfo?.description}
          </Text>
          <Accordion title="درباره این صفحه" className="!bg-white shadow-card !mt-5">
            <div className="text-justify text-sm [&>h2]:font-bold" dangerouslySetInnerHTML={{ __html: seoInfo?.seo_box ?? '' }} />
            {footers?.map((item: any, index: any) => (
              <Accordion key={index} title={item.title} className="mt-2">
                <MenuList className="flex !flex-row flex-wrap gap-x-14">
                  {item.items.map((menu: any) => (
                    <MenuItem key={menu.name} name={menu.name} link={menu.url} className="flex-[1_1_25rem] !justify-start">
                      <ChevronIcon dir="left" />
                    </MenuItem>
                  ))}
                </MenuList>
              </Accordion>
            ))}
          </Accordion>
        </div>
      )}
    </>
  );
};

export default SearchSeoBox;
