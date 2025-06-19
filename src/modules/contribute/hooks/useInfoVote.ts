import { splunkInstance } from '@/common/services/splunk';
import { useProfileDataStore } from '@/modules/contribute/store/profileData';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';

export const useInfoVote = () => {
  const router = useRouter();
  const profileData = useProfileDataStore(state => state.data);
  const { query } = useRouter();
  const userData = useUserInfoStore(state => state.info);
  const selectedCenter = profileData.centers?.find(center => center.id === router.query?.center_id);

  const doctorInfo = {
    name: profileData?.name,
    family: profileData?.family,
    id: profileData?.id,
    server_id: profileData?.server_id,
    slug: profileData?.slug,
    expertise: profileData?.expertises?.[0].expertise?.name,
    group_expertises: profileData.group_expertises?.[0]?.name,
  };

  const userInfo = {
    terminal_id: getCookie('terminal_id'),
    username: userData?.cell,
  };

  const like = (value: string | undefined, type: string) => {
    splunkInstance('contribute').sendEvent({
      group: 'contribute',
      type,
      event: {
        event_action: 'like',
        data: {
          doctor: doctorInfo,
          center: {
            center_id: selectedCenter?.id,
            server_id: selectedCenter?.server_id,
            center_name: selectedCenter?.name,
            city: selectedCenter?.city,
            province: selectedCenter?.province,
          },
          user: userInfo,
          value,
          url: window.location.pathname,
          query: { ...query },
        },
      },
    });
  };

  const dislike = (value: string | undefined, type: string) => {
    splunkInstance('contribute').sendEvent({
      group: 'contribute',
      type,
      event: {
        event_action: 'dislike',
        data: {
          doctor: doctorInfo,
          center: {
            center_id: selectedCenter?.id,
            server_id: selectedCenter?.server_id,
            center_name: selectedCenter?.name,
            city: selectedCenter?.city,
            province: selectedCenter?.province,
          },
          user: userInfo,
          value,
          url: window.location.pathname,
          query: { ...query },
        },
      },
    });
  };

  const submit = (value: string | undefined, type: string) => {
    splunkInstance('contribute').sendEvent({
      group: 'contribute',
      type,
      event: {
        event_action: 'add',
        data: {
          doctor: doctorInfo,
          center: {
            center_id: selectedCenter?.id,
            server_id: selectedCenter?.server_id,
            center_name: selectedCenter?.name,
            city: selectedCenter?.city,
            province: selectedCenter?.province,
          },
          user: userInfo,
          value,
          url: window.location.pathname,
          query: { ...query },
        },
      },
    });
  };

  return { like, dislike, submit };
};
