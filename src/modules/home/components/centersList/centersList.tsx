import { useSearch } from '@/common/apis/services/search/search';
import Opener from '@/common/components/atom/opener/opener';
import Text from '@/common/components/atom/text/text';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export const CentersList = () => {
  const page = useRef(1);
  const [centers, setCenters] = useState<any[]>([]);
  const centersApi = useSearch({
    route: `ir/center`,
    query: {
      page: page.current,
    },
  });

  useEffect(() => {
    if (centersApi.data?.search?.result?.length > 0) {
      setCenters(prev => [...prev, ...centersApi.data.search.result]);
      page.current++;
      centersApi.refetch();
    }
  }, [centersApi.data]);
  if (centers.length === 0) return null;

  return (
    <div className="flex flex-col space-y-3 lg:w-[50rem] pb-10">
      <Text fontSize="sm" fontWeight="bold">
        لیست مراکز
      </Text>
      <Opener openButtonText="بیشتر" height={200} closeButtonText="کمتر" className=" border border-slate-100  p-4 rounded-lg">
        <div className="flex flex-wrap gap-2">
          {centers.map((item: any) => (
            <>
              <Link href={item.url} shallow scroll key={item.id}>
                <a>
                  <Text fontWeight="medium" fontSize="sm" className="hover:text-primary transition-colors">
                    {item.title}
                  </Text>
                </a>
              </Link>
              .
            </>
          ))}
        </div>
      </Opener>
    </div>
  );
};

export default CentersList;
