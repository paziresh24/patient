import Breadcrumbs from '@/common/components/atom/breadcrumbs/breadcrumbs';
import { MenuItem, MenuList } from '@/common/components/atom/menu';
import Opener from '@/common/components/atom/opener';
import Text from '@/common/components/atom/text/text';
import ChevronIcon from '@/common/components/icons/chevron';

interface ProfileSeoBoxProps {
  similarLinks?: {
    name: string;
    url: string;
  }[];
  about?: string;
  breadcrumbs?: {
    text: string;
    href: string;
  }[];
}

export const ProfileSeoBox = (props: ProfileSeoBoxProps) => {
  const { about, breadcrumbs, similarLinks } = props;
  return (
    <div className="flex flex-col space-y-3">
      {similarLinks && (
        <div className="p-4 transition-all bg-white md:rounded-lg">
          <Opener openButtonText="مشاهده بیشتر" closeButtonText="مشاهده کمتر">
            <MenuList className="flex !flex-row flex-wrap gap-x-14">
              {similarLinks.map(({ name, url }) => (
                <MenuItem key={name} name={name} link={url} className="flex-[1_1_10rem] !justify-start">
                  <ChevronIcon dir="left" />
                </MenuItem>
              ))}
            </MenuList>
          </Opener>
        </div>
      )}
      {breadcrumbs && <Breadcrumbs className="px-4 md:px-0" items={breadcrumbs} />}
      {about && (
        <div className="p-4 bg-white md:rounded-lg">
          <Text fontSize="sm" as="div" className="leading-6" align="justify" dangerouslySetInnerHTML={{ __html: about }} />
        </div>
      )}
    </div>
  );
};

export default ProfileSeoBox;
