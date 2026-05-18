import { useUserInfoStore } from '../login/store/userInfo';
import Text from '@/common/components/atom/text';
import useModal from '@/common/hooks/useModal';
import Modal from '@/common/components/atom/modal';
import { AppFrame } from './appFrame';
import { splunkInstance } from '@/common/services/splunk';
import AddIcon from '@/common/components/icons/add';
import { useQueryClient } from '@tanstack/react-query';
import { PROFILE_HAMDAST_WIDGETS_QUERY_KEY } from '../profile/functions/fetchProfileHamdastWidgets';
import EditIcon from '@/common/components/icons/edit';
import { useFeatureIsOn } from '@growthbook/growthbook-react'
import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
interface HamdastProps {
  app: string;
  addLabel: string,
  editLabel: string,
  profileData: any,
  title: string
  isInstall?: boolean
}

export const ProfileFallback = ({ addLabel, editLabel, title, app, profileData, isInstall }: HamdastProps) => {
  const info = useUserInfoStore(state => state.info);
  const queryClient = useQueryClient();
  const { handleOpen, modalProps } = useModal();
  const isEnable = useFeatureIsOn("hamdast::profile_addon")
  const [fallbackRef, inViewFallback] = useInView({ triggerOnce: true, threshold: 0.3 });
  const previousInstallStateRef = useRef<boolean | undefined>(isInstall);

  const sendProfileFallbackEvent = (type: string, metaData: Record<string, any> = {}) => {
    splunkInstance('dashboard').sendEvent({
      group: 'hamdast_profile_fallback',
      type,
      event: {
        is_doctor: info?.is_doctor,
        source: 'profile',
        user_id: info?.id,
        meta_data: {
          key: app,
          open_from: 'profile',
          widget_status: isInstall ? 'active' : 'inactive',
          ...metaData,
        },
      },
    });
  };
  const sendLegacyOpenAppEvent = () => {
    splunkInstance('dashboard').sendEvent({
      group: 'launcher_statistics',
      type: 'apps',
      event: {
        is_doctor: info?.is_doctor,
        meta_data: {
          key: app,
          open_from: 'profile',
        },
        source: 'apps',
        user_id: info?.id,
      },
    });
  };

  const refetchHamdastWidgets = () => {
    queryClient.invalidateQueries([PROFILE_HAMDAST_WIDGETS_QUERY_KEY]);
    queryClient.invalidateQueries(['getWidgets']);
  };

  const onWidgetChange = (action?: 'add' | 'remove' | 'update') => {
    refetchHamdastWidgets();
    if (!action) return;
    sendProfileFallbackEvent('widget_changed', { action });
  };


  useEffect(() => {
    if (inViewFallback) {
      sendProfileFallbackEvent('visible');
    }
  }, [inViewFallback]);

  if (!info?.id || !info?.is_doctor || profileData?.user_id !== info?.id || !isEnable) return null
  return (
    <>
      {!isInstall && (
        <div
          ref={fallbackRef}
          onClick={() => {
            sendLegacyOpenAppEvent();
            sendProfileFallbackEvent('click', { cta_type: 'add' });
            handleOpen();
          }}
          className="flex items-center justify-center p-5 mx-4 transition-all border-2 border-dashed rounded-lg cursor-pointer md:mx-0 hover:bg-slate-200/30 space-s-2 text-slate-400 border-slate-200"
        >
          <AddIcon className="w-5 h-5" />
          <Text fontWeight="medium">{addLabel}</Text>
        </div>
      )}
      {
        isInstall && (
          <div ref={fallbackRef} className="flex px-4">
            <button
              type="button"
              onClick={() => {
                sendLegacyOpenAppEvent();
                sendProfileFallbackEvent('click', { cta_type: 'edit' });
                handleOpen();
              }}
              className="cursor-pointer w-full text-primary  bg-white  border border-slate-200 hover:bg-slate-50 text-xs mb-1 justify-center flex items-center gap-1.5 font-semibold z-10 p-2 rounded-full transition-colors"
            >
              <EditIcon className="w-4 h-4" />
              <Text>{editLabel}</Text>
            </button>
          </div>
        )
      }
      <Modal {...modalProps} title={title} bodyClassName="p-0" className='h-[40rem]'>
        <AppFrame appKey={app} params={['launcher']} queries={{ open_from: 'profile' }} dontShowProfile onChangeWidget={onWidgetChange} />
      </Modal>
    </>
  )
};

export default ProfileFallback;
