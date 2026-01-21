import Button from '@/common/components/atom/button';
import Divider from '@/common/components/atom/divider';
import Loading from '@/common/components/atom/loading/loading';
import Modal from '@/common/components/atom/modal';
import Text from '@/common/components/atom/text';
import useModal from '@/common/hooks/useModal';
import { splunkInstance } from '@/common/services/splunk';
import classNames from '@/common/utils/classNames';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import axios, { isAxiosError } from 'axios';
import { deleteCookie, getCookie } from 'cookies-next';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useEffectOnce } from 'react-use';
import { v4 as uuidV4 } from 'uuid';
import { usePayRequest } from '../apis/pay';

export const HamdastPayment = ({ app_key, app_name, icon, iframeRef }: { app_key: string; app_name: string; icon?: string; iframeRef: any }) => {
  const { handleClose, handleOpen, modalProps } = useModal({
    onClose: () => {
      handleCancelPayment()
    },
  });
  const { isLogin, info } = useUserInfoStore();
  const { handleOpenLoginModal } = useLoginModalContext();
  const [balances, setBalances] = useState<any>([]);
  const [selectedCenter, setSelectedCenter] = useState(balances?.[0]?.center_id)
  const [isLoadingBalances, setIsLoadingBalances] = useState(true);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const payRequest = usePayRequest();
  const [isLoading, setIsLoading] = useState(true);
  const [fullScreen, setFullScreen] = useState(false);
  const intervalCloseRef = useRef<any>();
  const [receiptData, setReceiptData] = useState<any>(null);
  const paymentData = useRef<any>({});
  const gatewayWindow = useRef<any>();

  useEffect(() => {
    // Ensure info?.provider?.centers is an array before proceeding
    const centers = info?.provider?.centers?.filter?.(
      center =>
        center.id == "5532"
    ) ?? [];
    if (!centers.length) {
      setBalances([]);
      setIsLoadingBalances(false);
      return;
    }
    setIsLoadingBalances(true);
    Promise.all(
      centers.map((item: any) =>
        axios.get(
          `https://apigw.paziresh24.com/katibe/v1/transactions/balance/p24${item.id == "5532" ? `` : `?centerid=${item.id}&account=organization`
          }`,
          {
            withCredentials: true,
          }
        ).then(data => ({
          center_id: item.id,
          balance: data.data.data.balance,
        }))
      )
    )
      .then((data) => {
        setBalances(
          data.map((item: any) => ({
            center_id: item.center_id,
            balance: item.balance,
          }))
        );
        setSelectedCenter(data?.[0]?.center_id)
        setIsLoadingBalances(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoadingBalances(false);
      })
      .finally(() => {
        setIsLoadingBalances(false);
      });
  }, [info?.provider?.centers]);



  const openAndCreateReceipt = () => {
    deleteCookie('payment_state', { domain: '.paziresh24.com', path: '/' });
    handleOpen();
    if (paymentData.current?.receipt_id) {
      splunkInstance('dashboard').sendEvent({
        group: 'hamdast_payment',
        type: 'show_receipt',
        event: {
          is_doctor: info?.is_doctor,
          user_id: info?.id,
          meta_data: {
            app_key: app_key,
            product_key: paymentData.current?.product_key,
            receipt_id: paymentData.current?.receipt_id,
          },
        },
      });
      setIsLoading(false);
      return;
    }
    axios
      .post(
        `https://hamdast.paziresh24.com/api/v1/apps/${app_key}/payment/`,
        {
          product_key: paymentData.current?.product_key,
          ...(paymentData.current?.payload && { payload: paymentData.current?.payload }),
        },
        {
          withCredentials: true,
        },
      )
      .then(data => {
        setReceiptData(data.data);
        paymentData.current = {
          ...paymentData.current,
          receipt_id: data.data?.receipt_id,
        };
        splunkInstance('dashboard').sendEvent({
          group: 'hamdast_payment',
          type: 'show_receipt',
          event: {
            is_doctor: info?.is_doctor,
            user_id: info?.id,
            meta_data: {
              app_key: app_key,
              product_key: paymentData.current?.product_key,
              receipt_id: paymentData.current?.receipt_id,
            },
          },
        });
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const handleEventFunction = (messageEvent: MessageEvent) => {
      if (messageEvent.data?.hamdast?.event === 'HAMDAST_PAYMENT_PAY') {
        setFullScreen(false);
        setIsLoading(true);
        paymentData.current = {
          hash_id: messageEvent.data?.hamdast?.hash_id,
          product_key: messageEvent.data?.hamdast?.data?.product_key,
          payload: messageEvent.data?.hamdast?.data?.payload,
          receipt_id: messageEvent.data?.hamdast?.data?.receipt_id,
        };

        if (!isLogin) {
          return handleOpenLoginModal({
            state: true,
            postLogin(userInfo) {
              return openAndCreateReceipt();
            },
            onClose: () => {
              iframeRef.current?.contentWindow?.postMessage(
                {
                  hamdast: {
                    event: 'HAMDAST_PAYMENT_CANCEL',
                    action: 'forwardToApp',
                    data: {
                      event: 'HAMDAST_PAYMENT_CANCEL',
                      payload: paymentData.current?.payload,
                      product_key: paymentData.current?.product_key,
                      receipt_id: paymentData.current?.receipt_id,
                    },
                    hash_id: paymentData.current?.hash_id,
                  },
                },
                '*',
              );
            },
          });
        }

        openAndCreateReceipt();
      }







    };
    window.addEventListener('message', handleEventFunction);

    return () => {
      window.removeEventListener('message', handleEventFunction);
    };
  }, [isLogin, modalProps.isOpen]);

  const handleCheckPayment = () => {
    setIsLoadingPayment(true);

    if (balances.find((balance: any) => balance.center_id == selectedCenter)?.balance >= receiptData?.price) {
      handlePayment();

    } else {
      handleIncreaseBalance();
    }
  };



  useEffect(() => {
    if (fullScreen && isLoading) {
      intervalCloseRef.current = setInterval(() => {
        if (!getCookie('payment_state')) return;
        const status = getCookie('payment_state')?.toString().includes('success');
        gatewayWindow.current?.close();
        deleteCookie('payment_state');

        if (status) {
          handlePayment();
        } else {
          handleCancelPayment();
        }
      })
    }

    return () => {
      clearInterval(intervalCloseRef.current)
    }

  }, [fullScreen, isLoading])

  const handleIncreaseBalance = () => {
    setFullScreen(true);
    setIsLoading(true);
    setIsLoadingPayment(false);
    gatewayWindow.current?.close();
    deleteCookie('payment_state');
    gatewayWindow.current = window.open(`https://apigw.paziresh24.com/katibe/v1/topups?amount=${receiptData?.price}&returnlink=${encodeURIComponent("https://www.paziresh24.com/_/bimehnama/payment_return_link/?status=success")}&uuid=${uuidV4()}&cancel_returnlink=${encodeURIComponent("https://www.paziresh24.com/_/bimehnama/payment_return_link/?status=cancel")}&receipt_id=${receiptData?.receipt_id}&center_id=${selectedCenter}`, '_blank');
    splunkInstance('dashboard').sendEvent({
      group: 'hamdast_payment',
      type: 'open_gateway',
      event: {
        is_doctor: info?.is_doctor,
        user_id: info?.id,
        meta_data: {
          app_key: app_key,
          product_key: paymentData.current?.product_key,
          receipt_id: paymentData.current?.receipt_id,
        },
      },
    });
  };


  const handlePayment = async () => {
    gatewayWindow.current?.close();
    setIsLoadingPayment(true);
    try {
      await payRequest.mutateAsync({
        id: receiptData?.receipt_id,
      });

      iframeRef.current?.contentWindow?.postMessage(
        {
          hamdast: {
            event: 'HAMDAST_PAYMENT_SUCCESS',
            action: 'forwardToApp',
            data: {
              event: 'HAMDAST_PAYMENT_SUCCESS',
              payload: paymentData.current?.payload,
              product_key: paymentData.current?.product_key,
              receipt_id: paymentData.current?.receipt_id,
            },
            hash_id: paymentData.current?.hash_id,
          },
        },
        '*',
      );
      splunkInstance('dashboard').sendEvent({
        group: 'hamdast_payment',
        type: 'success_receipt',
        event: {
          is_doctor: info?.is_doctor,
          user_id: info?.id,
          meta_data: {
            app_key: app_key,
            product_key: paymentData.current?.product_key,
            receipt_id: paymentData.current?.receipt_id,
          },
        },
      });
    } catch (error) {
      handleCancelPayment();
      if (isAxiosError(error)) {

        toast.error(error?.response?.data?.message || 'خطا در پرداخت');
        splunkInstance('dashboard').sendEvent({
          group: 'hamdast_payment',
          type: 'error_receipt',
          event: {
            is_doctor: info?.is_doctor,
            user_id: info?.id,
            meta_data: {
              app_key: app_key,
              product_key: paymentData.current?.product_key,
              receipt_id: paymentData.current?.receipt_id,
              message: error?.response?.data?.message,
            },
          },
        });
      }
    } finally {
      handleClose();
      setIsLoadingPayment(false);
    }
  };

  const handleCancelPayment = () => {
    gatewayWindow.current?.close();

    splunkInstance('dashboard').sendEvent({
      group: 'hamdast_payment',
      type: 'cancel_receipt',
      event: {
        is_doctor: info?.is_doctor,
        user_id: info?.id,
        meta_data: {
          app_key: app_key,
          product_key: paymentData.current?.product_key,
          receipt_id: paymentData.current?.receipt_id,
        },
      },
    });
    iframeRef.current?.contentWindow?.postMessage(
      {
        hamdast: {
          event: 'HAMDAST_PAYMENT_CANCEL',
          action: 'forwardToApp',
          data: {
            event: 'HAMDAST_PAYMENT_CANCEL',
            payload: paymentData.current?.payload,
            product_key: paymentData.current?.product_key,
          },
          hash_id: paymentData.current?.hash_id,
        },
      },
      '*',
    );
    handleClose();

  }

  return (
    <div>
      <Modal
        bodyClassName="justify-center flex-col flex items-center"
        {...modalProps}
        fullScreen={fullScreen}
        onClose={fullScreen ? () => { } : modalProps.onClose}
        title='پرداخت'
        noHeader={fullScreen}
        noLine={fullScreen}
      >
        {isLoading && !fullScreen && <Loading />}
        {isLoading && fullScreen && <div className='flex flex-col gap-4 justify-center items-center'>
          <div className='flex flex-col justify-center items-center gap-2'>
            <Loading />
            <span className='text-sm font-medium'>درحال انتظار برای پرداخت</span>
            <Text fontSize='xs' className='text-center'>پس از پرداخت، خودکار به ابزارک {app_name} منتقل خواهید شد.</Text>
          </div>
          <Divider />
          <div className='flex flex-col gap-3 w-60'>
            <Text fontSize='xs' className='text-center'>اگر هنوز منتقل نشدید، روی دکمه‌های زیر بزنید.</Text>
            <Button size="sm" block onClick={handlePayment} loading={isLoadingPayment}>پرداخت را انجام دادم</Button>
            <Button size="sm" block variant='text' onClick={handleCancelPayment}>از پرداخت منصرف شدم</Button>

          </div>
        </div>}
        {
          !isLoading && (
            <div className='w-full flex flex-col gap-3'>
              <div className='flex justify-between items-center pl-3'>

                <div className='flex items-center gap-2'>
                  <img src={icon} className='w-12 h-12 min-w-12 object-cover rounded-md border border-slate-100' />
                  <div className='flex flex-col'>
                    <Text fontSize="base" fontWeight='bold' className='line-clamp-1'>
                      {
                        receiptData?.title
                      }
                    </Text>
                    <Text fontSize="sm" className='opacity-80'>
                      {app_name}
                    </Text>
                  </div>
                </div>
                <Text fontSize="base" fontWeight="bold" className='min-w-fit max-w-fit w-full'>
                  {new Intl.NumberFormat('fa-IR').format(receiptData?.price / 10)}{' '}تومان
                </Text>
              </div>
              <Divider />
              <div className='flex flex-col gap-3'>
                <Text fontSize='sm' fontWeight='semiBold'>
                  پول از حساب کدام مرکزدرمانی شما کسر شود؟
                </Text>
                <div className='flex flex-col gap-2'>
                  {
                    !info?.provider?.centers?.some?.(center => center.id == "5532") && (
                      <div className={classNames('flex cursor-pointer flex-col border border-slate-300 rounded-md p-3', { "border-primary border-2": true })}>
                        <div className='flex items-center gap-1'>
                          <Text fontSize='xs' fontWeight='medium' className="min-w-fit max-w-fit w-full">
                            کیف پول
                          </Text>
                        </div>
                        <div>
                          <Text fontSize='sm' fontWeight='medium' className='text-primary'>
                            موجودی:
                          </Text>
                          <Text fontSize='sm' fontWeight='medium' className='text-primary'>
                            {0}{' '}تومان
                          </Text>
                        </div>
                      </div>
                    )
                  }
                  {
                    info?.provider?.centers?.filter?.(center => center.id == "5532")?.map?.((item, index) => (
                      <div key={item?.id} onClick={() => setSelectedCenter(item?.id)} className={classNames('flex cursor-pointer flex-col border border-slate-300 rounded-md p-3', { "border-primary border-2": selectedCenter == item.id })}>
                        <div className='flex items-center gap-1'>
                          <Text fontSize='xs' fontWeight='medium' className="min-w-fit max-w-fit w-full">
                            {item?.name ?? "کیف پول"}
                          </Text>
                          {
                            item?.id !== "5532" &&
                            <Text className='line-clamp-1 text-[10px] max-w-full opacity-50'>({item?.address})</Text>

                          }
                        </div>
                        <div>
                          <Text fontSize='sm' fontWeight='medium' className='text-primary'>
                            موجودی:                        </Text>
                          <Text fontSize='sm' fontWeight='medium' className='text-primary'>
                            {new Intl.NumberFormat('fa-IR').format((balances.find((balance: any) => balance.center_id == item.id)?.balance ?? 0) / 10)}{' '}تومان
                          </Text>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
              <Divider />
              <Button variant="primary" size="sm" block loading={isLoadingPayment} onClick={handleCheckPayment}>
                {
                  balances.find((balance: any) => balance.center_id == selectedCenter)?.balance >= receiptData?.price
                    ? 'پرداخت'
                    : 'افزایش موجودی و پرداخت'
                }
              </Button>
            </div>
          )}
      </Modal>
    </div>
  );
};
