import React from 'react';
import dynamic from 'next/dynamic';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useRouter } from 'next/router';

const HamdastKhedmatWidget = dynamic(() => import('.plasmic/HamdastKhedmatWidget'), {
  ssr: false,
});

interface HamdastKhedmatInactiveWrapperProps {
  profileData: Record<string, any>;
  centerId: string;
  userId?: string | number;
}

export const HamdastKhedmatInactiveWrapper: React.FC<HamdastKhedmatInactiveWrapperProps> = ({
  profileData,
  centerId,
  userId,
}) => {
  const userInfo = useUserInfoStore(state => state.info);
  const router = useRouter();

  const targetUserId = userId || profileData?.user_id;
  const isOwnDoctor = Boolean(
    (userInfo?.id && targetUserId && String(userInfo.id) === String(targetUserId)) ||
    router?.query?.preview_khedmat === 'true' ||
    router?.query?.preview_khedmat_doctor === 'true'
  );

  if (!isOwnDoctor) return null;

  return (
    <div className="flex flex-col w-full gap-2">
      <HamdastKhedmatWidget
        profileData={{ ...profileData, user_id: targetUserId }}
        widgetData={{
          center_id: centerId,
          placement: ['center_info'],
        }}
        isInactiveView={true}
      />
    </div>
  );
};

export default HamdastKhedmatInactiveWrapper;
