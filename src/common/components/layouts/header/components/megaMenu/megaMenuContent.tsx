import ChevronIcon from '@/common/components/icons/chevron';
import classNames from '@/common/utils/classNames';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface MegaMenuContentProps {
  items: Item[];
  onClose: () => void;
}

type Item = {
  title: string;
  link: string;
  sub_menu?: Item[];
};

const MegaMenuContent = ({ items, onClose }: MegaMenuContentProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    if (ref.current) {
      ref.current?.scrollTo({
        left: -((ref.current?.clientWidth ?? 0) * (page - 1)),
      });
      setIsEnded(1 === Math.ceil(ref.current?.scrollWidth / ((ref.current?.clientWidth ?? 0) * page)));
    }
  }, [page]);

  return (
    <div className="w-full flex items-center relative">
      {page !== 1 && (
        <button
          className="absolute right-5 z-50 bg-white shadow-lg  border border-slate-50 rounded-full w-10 h-10 flex items-center justify-center text-white"
          onClick={() => {
            setPage(prev => prev - 1);
          }}
        >
          <ChevronIcon dir="right" className="text-slate-700" />
        </button>
      )}
      <div ref={ref} className="flex h-full flex-col flex-wrap ml-8 overflow-hidden scroll-smooth w-full relative p-4">
        {items.map((menu, index) => {
          return (
            <div key={index}>
              <Link
                className={classNames(`text-slate-700 mb-2 mt-1 block text-sm line-clamp-1 w-4/5`, {
                  'font-bold': !!menu.sub_menu,
                })}
                onClick={onClose}
                href={menu.link ?? '#'}
                prefetch={false}
              >
                {menu.title}
              </Link>

              {menu.sub_menu &&
                menu.sub_menu.map((item, index) => {
                  return (
                    <Link
                      key={index}
                      href={item.link ?? '#'}
                      onClick={onClose}
                      prefetch={false}
                      className="text-slate-700 cursor-pointer mb-2 mt-1 block text-sm line-clamp-1 w-4/5"
                    >
                      {item.title}
                    </Link>
                  );
                })}
            </div>
          );
        })}
      </div>
      {!isEnded && (
        <button
          className="absolute left-5 bg-white shadow-lg  border border-slate-50 rounded-full w-10 h-10 flex items-center justify-center text-white"
          onClick={() => {
            setPage(prev => prev + 1);
          }}
        >
          <ChevronIcon dir="left" className="text-slate-700" />
        </button>
      )}
    </div>
  );
};

export default MegaMenuContent;
