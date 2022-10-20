import { splunkInstance } from '@/common/services/splunk';
import { useProfileDataStore } from '@/modules/contribute/store/profileData';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

export const useInfoVote = (type: string) => {
  const profileData = useProfileDataStore(state => state.data);
  const { query } = useRouter();
  const userData = useUserInfoStore(state => state.info);

  const doctorInfo = {
    name: profileData?.name,
    family: profileData?.family,
    id: profileData?.id,
    server_id: profileData?.server_id,
    slug: profileData?.slug,
  };

  const userInfo = {
    terminal_id: getCookie('terminal_id'),
    username: userData?.username,
  };

  const like = (value: string | undefined) => {
    splunkInstance().sendEvent({
      group: 'contribute',
      type,
      event: {
        event_action: 'like',
        data: {
          doctor: doctorInfo,
          user: userInfo,
          value,
          url: window.location.pathname,
          query: { ...query },
        },
      },
    });
    toast.success('نظر شما با موفقیت ثبت شد');
  };

  const dislike = (value: string | undefined) => {
    splunkInstance().sendEvent({
      group: 'contribute',
      type,
      event: {
        event_action: 'dislike',
        data: {
          doctor: { ...doctorInfo },
          user: userInfo,
          value,
          url: window.location.pathname,
          query: { ...query },
        },
      },
    });
  };

  const submit = (value: string | undefined) => {
    splunkInstance().sendEvent({
      group: 'contribute',
      type,
      event: {
        event_action: 'add',
        data: {
          doctor: doctorInfo,
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
