import { Components } from 'hamdast';
import pick from 'lodash/pick';
import { useUserInfoStore } from '../login/store/userInfo';
import Text from '@/common/components/atom/text';
import PlusIcon from '@/common/components/icons/plus';
import useModal from '@/common/hooks/useModal';
import Modal from '@/common/components/atom/modal';
import { AppFrame } from './appFrame';
import { splunkInstance } from '@/common/services/splunk';

interface HamdastProps {
  id: string;
  app: string;
  backendData?: any;
  profileData: Record<string, any>;
  widgetData: Record<string, any>;
}

export const Hamdast = ({ id, app, backendData, profileData, widgetData }: HamdastProps) => {
  const info = useUserInfoStore(state => state.info);
  const { handleOpen, modalProps } = useModal();
  if (!id) return null;

  const { Component, component_id, project_id, props_allowed } = (Components as any)?.[id] ?? {
    Component: () => null,
    id: '',
    propsAllowed: [],
  };

  if (info?.id && info?.is_doctor && profileData?.user_id !== info?.id)
    return (
      <div className="w-full flex flex-col relative">
        <Component
          data-fragment-component-id={component_id}
          data-fragment-project-id={project_id}
          data-fragment-component={id}
          {...{ ...pick({ data: backendData, profileData, widgetData }, props_allowed ?? []) }}
        />
        {app && (
          <>
            <div className="flex justify-between">
              <div className="border border-t-0 border-l-0 rounded-br-3xl border-dashed w-full mb-7 border-slate-400" />
              <div
                onClick={() => {
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
                  handleOpen();
                }}
                className="self-center cursor-pointer min-w-fit bg-primary text-white max-w-fit text-xs mt-2 mb-3 flex items-center gap-1 font-medium z-10 p-2 rounded-full"
              >
                <PlusIcon className="w-4 h-4" />
                <Text>افزودن بخش بالا به پروفایلم</Text>
              </div>
              <div className="border border-t-0 border-r-0 rounded-bl-3xl border-dashed w-full mb-7 border-slate-400" />
            </div>
            <Modal {...modalProps} fullScreen noHeader noLine bodyClassName="p-0">
              <AppFrame appKey={app} params={['launcher']} queries={{ open_from: 'profile' }} showBackButton />
            </Modal>
          </>
        )}
      </div>
    );

  return (
    <Component
      data-fragment-component-id={component_id}
      data-fragment-project-id={project_id}
      data-fragment-component={id}
      {...{ ...pick({ data: backendData, profileData, widgetData }, props_allowed ?? []) }}
    />
  );
};

export default Hamdast;
