/* eslint-disable jsx-a11y/alt-text */
import Button from '@/common/components/atom/button';
import Modal from '@/common/components/atom/modal';
import useModal from '@/common/hooks/useModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useGetWidgetInfo } from '../apis/widgetInfo';
import Loading from '@/common/components/atom/loading';
import { useGetCenters } from '@/common/apis/services/profile/centers';
import classNames from '@/common/utils/classNames';
import CheckIcon from '@/common/components/icons/check';

export const HamdastWidget = ({ app_id, app_name, iframeRef }: { app_id: string; app_name: string; iframeRef: any }) => {
  const widgetInfo = useGetWidgetInfo({ app_id }, { enabled: false });
  const { handleClose, handleOpen, modalProps } = useModal({
    onClose: () => {
      cancel();
    },
  });
  const { handleClose: handlePreviewWidgetClose, handleOpen: handlePreviewWidgetOpen, modalProps: previewWidgetModalProps } = useModal();
  const { isLogin, info } = useUserInfoStore();
  const hashId = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelLoading, setIsCancelLoading] = useState(false);
  const getCenters = useGetCenters(
    { user_id: info?.id?.toString()! },
    { enabled: widgetInfo.data?.data?.placement.includes('center_info') },
  );
  const [selectedCenter, setSelctedCenter] = useState('');

  useEffect(() => {
    if (widgetInfo.data?.data?.placement.includes('center_info') && getCenters?.data) {
      const centers = getCenters?.data?.data?.items?.filter((center: any) => center.id !== '5532');
      setSelctedCenter(centers?.length == 1 ? centers?.[0]?.id : '');
    }
  }, [widgetInfo.data?.data?.placement.includes('center_info'), getCenters?.data]);

  useEffect(() => {
    const handleEventFunction = (messageEvent: MessageEvent) => {
      if (messageEvent.data?.hamdast?.event === 'HAMDAST_WIDGET_ADD_TO_PROFILE') {
        hashId.current = messageEvent.data?.hamdast?.hash_id;
        widgetInfo.remove();
        setSelctedCenter('');
        widgetInfo.refetch();
        handleOpen();
      }
      if (messageEvent.data?.hamdast?.event === 'HAMDAST_WIDGET_REMOVE_FROM_PROFILE') {
        hashId.current = messageEvent.data?.hamdast?.hash_id;
        remove();
      }
    };
    window.addEventListener('message', handleEventFunction);

    return () => {
      window.removeEventListener('message', handleEventFunction);
    };
  }, [isLogin]);

  const accept = async () => {
    setIsLoading(true);
    try {
      await axios.post(
        'https://hamdast.paziresh24.com/api/v1/widgets/',
        {
          app_id: app_id,
          ...(widgetInfo.data?.data?.placement.includes('center_info') &&
            selectedCenter && {
              placements_metadata: {
                center_info: {
                  center_ids: [selectedCenter],
                },
              },
            }),
        },
        { withCredentials: true },
      );
      handleClose();
      if (widgetInfo.data?.data?.successful_popup?.title) {
        handlePreviewWidgetOpen();
      }
      iframeRef.current?.contentWindow?.postMessage(
        {
          hamdast: {
            event: 'HAMDAST_WIDGET_ADD_TO_PROFILE',
            action: 'forwardToApp',
            data: {
              status: 'ACCEPTED',
            },
            hash_id: hashId.current,
          },
        },
        '*',
      );
    } catch (error) {
      iframeRef.current?.contentWindow?.postMessage(
        {
          hamdast: {
            event: 'HAMDAST_WIDGET_ADD_TO_PROFILE',
            action: 'forwardToApp',
            data: {
              status: 'CANCELED',
            },
            hash_id: hashId.current,
          },
        },
        '*',
      );
    } finally {
      handleClose();
      setIsLoading(false);
    }
  };

  const cancel = async () => {
    setIsCancelLoading(true);
    try {
      await axios.delete('https://hamdast.paziresh24.com/api/v1/widgets/', {
        data: {
          app_id: app_id,
        },
        withCredentials: true,
      });
      iframeRef.current?.contentWindow?.postMessage(
        {
          hamdast: {
            event: 'HAMDAST_WIDGET_ADD_TO_PROFILE',
            action: 'forwardToApp',
            data: {
              status: 'CANCELED',
            },
            hash_id: hashId.current,
          },
        },
        '*',
      );
    } catch (error) {
      iframeRef.current?.contentWindow?.postMessage(
        {
          hamdast: {
            event: 'HAMDAST_WIDGET_ADD_TO_PROFILE',
            action: 'forwardToApp',
            data: {
              status: 'CANCELED',
            },
            hash_id: hashId.current,
          },
        },
        '*',
      );
    } finally {
      handleClose();
      setIsCancelLoading(false);
    }
  };

  const remove = async () => {
    try {
      await axios.delete('https://hamdast.paziresh24.com/api/v1/widgets/', {
        data: {
          app_id: app_id,
        },
        withCredentials: true,
      });
      iframeRef.current?.contentWindow?.postMessage(
        {
          hamdast: {
            event: 'HAMDAST_WIDGET_REMOVE_FROM_PROFILE',
            action: 'forwardToApp',
            data: {
              status: 'REMOVED',
            },
            hash_id: hashId.current,
          },
        },
        '*',
      );
    } catch (error) {
      iframeRef.current?.contentWindow?.postMessage(
        {
          hamdast: {
            event: 'HAMDAST_WIDGET_REMOVE_FROM_PROFILE',
            action: 'forwardToApp',
            data: {
              status: 'REMOVED',
            },
            hash_id: hashId.current,
          },
        },
        '*',
      );
    }
  };

  return (
    <div>
      <Modal noHeader {...modalProps} bodyClassName="gap-2 flex flex-col">
        {(widgetInfo.isLoading || widgetInfo?.error) && (
          <div className="flex justify-center items-center py-7">
            <Loading className="w-10" />
          </div>
        )}
        {widgetInfo.data?.data && (
          <>
            {widgetInfo.data?.data?.placement.includes('center_info') && (
              <div className="flex flex-col gap-3">
                <span className="text-sm font-medium">کدام مرکز درمانی را برای اضافه‌کردن ابزارک انتخاب می‌کنید؟</span>
                <div className="flex flex-col gap-3 p-3 bg-slate-50 rounded-lg">
                  {getCenters.data?.data?.items
                    ?.filter((center: any) => center.id !== '5532')
                    .map((center: any) => (
                      <div
                        key={center.id}
                        className={classNames('flex gap-3 items-center cursor-pointer p-3 border-2 rounded-lg border-slate-200', {
                          'border-primary text-primary': selectedCenter === center.id,
                        })}
                        onClick={() => setSelctedCenter(center?.id)}
                      >
                        <div
                          className={classNames('w-5 h-5 flex justify-center items-center rounded-full bg-slate-200', {
                            'bg-primary': selectedCenter === center.id,
                          })}
                        >
                          {selectedCenter === center.id && <CheckIcon className="text-white w-3 h-3" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm">{center?.name}</span>
                          <span className="text-xs">{center?.address}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
            {!widgetInfo.data?.data?.placement.includes('center_info') && (
              <>
                <span className="text-sm">
                  ابزارک <b>{app_name}</b> قصد دارد ویجتی را به پروفایل شما اضافه کند.
                </span>
                <span className="text-xs font-medium">آیا مایل به ادامه و افزودن آن به پروفایل خود هستید؟</span>
              </>
            )}
            <div className="flex gap-3">
              <Button
                loading={isLoading}
                className="w-full"
                onClick={accept}
                disabled={widgetInfo.data?.data?.placement.includes('center_info') ? !selectedCenter : false}
              >
                افزودن
              </Button>
              <Button loading={isCancelLoading} className="w-full" variant="secondary" onClick={cancel}>
                انصراف
              </Button>
            </div>
          </>
        )}
      </Modal>

      <Modal noHeader {...previewWidgetModalProps} bodyClassName="gap-2 items-center text-center flex flex-col">
        <img className="w-96" src={widgetInfo.data?.data?.successful_popup?.image} />
        <span className="font-bold">{widgetInfo.data?.data?.successful_popup?.title}</span>
        <span className="text-sm">{widgetInfo.data?.data?.successful_popup?.description} </span>
        <div className="flex gap-3 w-full">
          <Button className="w-full" onClick={() => window.open(`/dr/${info.provider?.slug}`)}>
            مشاهده پروفایل من
          </Button>
          <Button variant="secondary" className="w-full" onClick={handlePreviewWidgetClose}>
            بازگشت به {app_name}
          </Button>
        </div>
      </Modal>
    </div>
  );
};
