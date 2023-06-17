import { useGetDoctorTags } from '@/common/apis/services/rate/tags';
import Chips from '@/common/components/atom/chips/chips';
import Skeleton from '@/common/components/atom/skeleton/skeleton';
import Text from '@/common/components/atom/text/text';
import DiamondIcon from '@/common/components/icons/diamond';
import FrownIcon from '@/common/components/icons/frown';
import SmileIcon from '@/common/components/icons/smile';
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
              <SmileIcon className="text-green-500" />
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
              <FrownIcon className="text-red-500" />
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
