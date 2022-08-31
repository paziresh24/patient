import ChevronIcon from '@/components/icons/chevron';
import { useState } from 'react';
import Text from '../text';

interface AccordingMenuProps {
  title: string;
  items: Array<{
    title: string;
    link: string;
  }>;
}
const AccordingMenu: React.FC<AccordingMenuProps> = props => {
  const { title, items } = props;
  const [open, setOpen] = useState(false);
  return (
    <div className="md:basis-[49%]">
      <div className="bg-slate-50 cursor-pointer p-4 rounded-lg  " onClick={() => setOpen(!open)}>
        <div className="flex justify-between items-center">
          <Text as="h3" fontSize="sm" fontWeight="medium">
            {title}
          </Text>
          <ChevronIcon dir={open ? 'top' : 'bottom'} />
        </div>
        {open && (
          <ul className="pr-1 text-sm  mt-2 select-none">
            {items.map((link, index) => {
              return (
                <li key={index}>
                  <a href={link.link} className="py-1 px-0 block text-xs">
                    {link.title}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AccordingMenu;
