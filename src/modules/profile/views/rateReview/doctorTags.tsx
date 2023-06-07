import { useGetDoctorTags } from '@/common/apis/services/rate/tags';
import Chips from '@/common/components/atom/chips/chips';
import Skeleton from '@/common/components/atom/skeleton/skeleton';
import Text from '@/common/components/atom/text/text';
import DiamondIcon from '@/common/components/icons/diamond';
import { range } from 'lodash';
import { useEffect } from 'react';

interface DoctorTagsProps {
  symptomes?: string[];
  doctorId: string;
  serverId: string;
}

export const DoctorTags = (props: DoctorTagsProps) => {
  const { symptomes = [], doctorId, serverId } = props;
  const getDoctorTags = useGetDoctorTags();

  useEffect(() => {
    getDoctorTags.mutate({
      doctor_id: doctorId,
      server_id: serverId,
    });
  }, []);

  return (
    <div className="flex flex-col w-full p-4 space-y-4 bg-white/50">
      <div className="flex flex-col w-full space-y-3">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center space-s-1">
            <DiamondIcon className="text-amber-500" />
            <Text fontWeight="bold">خلاصه نظرات کاربران</Text>
          </div>
          <Text fontSize="sm" className="opacity-75">
            خلاصه نظرات کاربران توسط هوش مصنوعی تولید گردیده است.
          </Text>
        </div>
        <div className="flex flex-col w-full space-y-3 md:flex-row md:space-y-0 md:space-s-3">
          <div className="flex flex-col w-full p-4 space-y-3 bg-white border rounded-lg shadow-lg shadow-slate-400/20 border-slate-100">
            <div className="flex items-center space-s-1">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16ZM8 14.6667C11.6819 14.6667 14.6667 11.6819 14.6667 8C14.6667 4.3181 11.6819 1.33333 8 1.33333C4.3181 1.33333 1.33333 4.3181 1.33333 8C1.33333 11.6819 4.3181 14.6667 8 14.6667ZM4.03421 10.2108C3.91778 9.86153 4.10655 9.484 4.45585 9.36753C4.80515 9.25113 5.18269 9.43987 5.29912 9.7892C5.35226 9.9486 5.51166 10.2355 5.80474 10.5286C6.30672 11.0306 7.01313 11.3333 8 11.3333C8.98687 11.3333 9.69327 11.0306 10.1953 10.5286C10.4883 10.2355 10.6477 9.9486 10.7009 9.7892C10.8173 9.43987 11.1949 9.25113 11.5441 9.36753C11.8935 9.484 12.0822 9.86153 11.9658 10.2108C11.8523 10.5514 11.595 11.0145 11.1381 11.4714C10.3901 12.2194 9.34647 12.6667 8 12.6667C6.65351 12.6667 5.60995 12.2194 4.86193 11.4714C4.40501 11.0145 4.14774 10.5514 4.03421 10.2108ZM5.03647 6.5547C4.73011 6.75893 4.3162 6.67613 4.11197 6.3698C3.90773 6.06345 3.99051 5.64953 4.29687 5.4453L4.55727 5.2717C5.22907 4.82383 6.10427 4.82383 6.77607 5.2717L7.03647 5.4453C7.3428 5.64953 7.4256 6.06345 7.2214 6.3698C7.01713 6.67613 6.60322 6.75893 6.29687 6.5547L6.03647 6.3811C5.81253 6.23181 5.5208 6.23181 5.29687 6.3811L5.03647 6.5547ZM9.70313 6.5547C9.3968 6.75893 8.98287 6.67613 8.7786 6.3698C8.5744 6.06345 8.6572 5.64953 8.96353 5.4453L9.22393 5.2717C9.89573 4.82383 10.7709 4.82383 11.4427 5.2717L11.7031 5.4453C12.0095 5.64953 12.0923 6.06345 11.8881 6.3698C11.6838 6.67613 11.2699 6.75893 10.9635 6.5547L10.7031 6.3811C10.4792 6.23181 10.1875 6.23181 9.96353 6.3811L9.70313 6.5547Z"
                  fill="#0BB07B"
                />
              </svg>
              <Text fontSize="sm" fontWeight="medium">
                صفات برجسته پزشک از دیدگاه بیماران
              </Text>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(getDoctorTags.isLoading || getDoctorTags.isIdle) &&
                range(0, 5).map(i => <Skeleton key={i} rounded="full" w="100%" h="1.6rem" />)}
              {getDoctorTags.data?.data?.positive_tags?.map?.((tag: string) => (
                <Chips className="py-1 border !whitespace-normal text-emerald-500 border-emerald-500/20 bg-emerald-300/5" key={tag}>
                  <Text className="line-clamp-1">{tag}</Text>
                </Chips>
              ))}
            </div>
          </div>
          <div className="flex flex-col w-full p-4 space-y-3 bg-white border border-red-100 rounded-lg shadow-lg shadow-slate-400/20">
            <div className="flex items-center space-s-1">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8 1.45455C4.38505 1.45455 1.45455 4.38505 1.45455 8C1.45455 11.615 4.38505 14.5455 8 14.5455C11.615 14.5455 14.5455 11.615 14.5455 8C14.5455 4.38505 11.615 1.45455 8 1.45455ZM0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8Z"
                  fill="#D11010"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M8.00003 10.9279C7.48028 10.9279 6.96958 10.9919 6.5194 11.1134L6.51938 11.1134C6.06922 11.2349 5.69543 11.4097 5.43556 11.6201C5.1265 11.8704 4.65896 11.839 4.39129 11.5501C4.12362 11.2611 4.15716 10.8239 4.46622 10.5736C4.93579 10.1934 5.52318 9.94131 6.10879 9.78328M6.10881 9.78327C6.70609 9.62208 7.35632 9.54348 8.00003 9.54348C8.64375 9.54348 9.29399 9.62208 9.89129 9.78327L9.8913 9.78328C10.4769 9.94131 11.0643 10.1934 11.5339 10.5736C11.8429 10.8239 11.8765 11.261 11.6088 11.55C11.3411 11.839 10.8736 11.8704 10.5646 11.6201C10.3046 11.4097 9.93083 11.2349 9.48071 11.1134C9.03048 10.9919 8.51977 10.9279 8.00003 10.9279"
                  fill="#D11010"
                />
                <path
                  d="M5.75455 7.57904C6.29715 7.57904 6.73701 7.13918 6.73701 6.59659C6.73701 6.05399 6.29715 5.61413 5.75455 5.61413C5.21196 5.61413 4.77209 6.05399 4.77209 6.59659C4.77209 7.13918 5.21196 7.57904 5.75455 7.57904Z"
                  fill="#D11010"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M5.8949 5.94162C5.4815 5.94162 5.14636 6.23486 5.14636 6.59659C5.14636 6.95832 5.4815 7.25156 5.8949 7.25156C6.30831 7.25156 6.64344 6.95832 6.64344 6.59659C6.64344 6.23486 6.30831 5.94162 5.8949 5.94162ZM4.77209 6.59659C4.77209 6.05399 5.27479 5.61413 5.8949 5.61413C6.51501 5.61413 7.01771 6.05399 7.01771 6.59659C7.01771 7.13918 6.51501 7.57904 5.8949 7.57904C5.27479 7.57904 4.77209 7.13918 4.77209 6.59659Z"
                  fill="#D11010"
                />
                <path
                  d="M10.2458 7.57904C10.7884 7.57904 11.2282 7.13918 11.2282 6.59659C11.2282 6.05399 10.7884 5.61413 10.2458 5.61413C9.70317 5.61413 9.26331 6.05399 9.26331 6.59659C9.26331 7.13918 9.70317 7.57904 10.2458 7.57904Z"
                  fill="#D11010"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M10.1051 5.94162C9.6917 5.94162 9.35657 6.23486 9.35657 6.59659C9.35657 6.95832 9.6917 7.25156 10.1051 7.25156C10.5185 7.25156 10.8536 6.95832 10.8536 6.59659C10.8536 6.23486 10.5185 5.94162 10.1051 5.94162ZM8.9823 6.59659C8.9823 6.05399 9.485 5.61413 10.1051 5.61413C10.7252 5.61413 11.2279 6.05399 11.2279 6.59659C11.2279 7.13918 10.7252 7.57904 10.1051 7.57904C9.485 7.57904 8.9823 7.13918 8.9823 6.59659Z"
                  fill="#D11010"
                />
              </svg>
              <Text fontSize="sm" fontWeight="medium">
                موارد قابل توجه از دیدگاه بیماران
              </Text>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(getDoctorTags.isLoading || getDoctorTags.isIdle) &&
                range(0, 5).map(i => <Skeleton key={i} rounded="full" w="100%" h="1.6rem" />)}
              {getDoctorTags.data?.data?.negative_tags?.map?.((tag: string) => (
                <Chips className="py-1 !whitespace-normal text-red-500 border border-red-500/20 bg-red-300/5" key={tag}>
                  <Text className="line-clamp-1">{tag}</Text>
                </Chips>
              ))}
            </div>
            {getDoctorTags.isSuccess && getDoctorTags.data?.data?.negative_tags?.length === 0 && (
              <Text fontSize="sm" className="self-center text-slate-400" fontWeight="medium">
                چیزی برای نمایش وجود ندارد.
              </Text>
            )}
          </div>
        </div>
      </div>
      {symptomes?.length > 0 && (
        <div className="flex flex-col w-full space-y-3">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-s-1">
              <DiamondIcon className="text-amber-500" />
              <Text fontWeight="bold">دلایل مراجعه سایر بیماران به پزشک</Text>
            </div>
            <Text fontSize="sm" className="opacity-75">
              سایر بیماران به دلایل زیر به این پزشک مراجعه کرده اند.
            </Text>
          </div>
          <div className="grid grid-cols-2 gap-2 p-4 bg-white border rounded-lg shadow-lg shadow-slate-400/20 border-slate-100">
            {symptomes?.map?.(symptom => (
              <Chips className="py-1 !whitespace-normal border border-primary/20 bg-primary/5 text-primary" key={symptom}>
                <Text className="line-clamp-1">{symptom}</Text>
              </Chips>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorTags;
