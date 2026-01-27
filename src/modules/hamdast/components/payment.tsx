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
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useEffectOnce } from 'react-use';
import { v4 as uuidV4 } from 'uuid';
import { usePayRequest } from '../apis/pay';
import sortBy from 'lodash/sortBy'
import Switch from '@/common/components/atom/switch';

export default forwardRef(({ app_key, app_name, icon, onSuccess, onCancel, onError, showAutoRenew }: { app_key: string; app_name: string; icon?: string; onSuccess: (data: any) => void; onCancel: (data: any) => void, onError: (data: any) => void, showAutoRenew?: Boolean }, ref) => {
  const { handleClose, handleOpen, modalProps } = useModal({
    onClose: () => {
      handleCancelPayment()
    },
  });
  const { info } = useUserInfoStore();
  const [balances, setBalances] = useState<any>([]);
  const [selectedCenter, setSelectedCenter] = useState(balances?.[balances?.length - 1]?.center_id)
  const [isLoadingBalances, setIsLoadingBalances] = useState(true);
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const payRequest = usePayRequest();
  const [isLoading, setIsLoading] = useState(true);
  const [fullScreen, setFullScreen] = useState(false);
  const intervalCloseRef = useRef<any>();
  const [receiptData, setReceiptData] = useState<any>(null);
  const gatewayWindow = useRef<any>();
  const [isAutoRenew, setIsAutoRenew] = useState(false)

  useImperativeHandle(ref, () => ({
    open: (data: any) => {
      handleOpen();
      openAndCreateReceipt({
        ...data
      })
    },
  }));


  useEffect(() => {
    // Ensure info?.provider?.centers is an array before proceeding
    const centers = info?.provider?.centers?.filter?.(
      center =>
        center.id == "5532" || center.type_id == 1
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
        const sortedBalances = sortBy(data.map((item: any) => ({
          center_id: item.center_id,
          balance: +item.balance,
        })), 'balance')
        setBalances(
          sortedBalances
        );
        setSelectedCenter(sortedBalances?.[sortedBalances?.length - 1]?.center_id)
        setIsLoadingBalances(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoadingBalances(false);
      })
      .finally(() => {
        setIsLoadingBalances(false);
      });
  }, [info?.provider?.centers, modalProps?.isOpen]);


  const sendEventLog = (type: "show_receipt" | "success" | "cancel" | "open_gateway") => {
    splunkInstance('dashboard').sendEvent({
      group: 'hamdast_payment',
      type: type,
      event: {
        is_doctor: info?.is_doctor,
        user_id: info?.id,
        meta_data: {
          app_key: app_key,
          product_key: receiptData?.product_key,
          plan_key: receiptData?.plan_key,
          receipt_id: receiptData?.receipt_id,
          center_id: selectedCenter
        },
      },
    });
  }



  const openAndCreateReceipt = ({ receipt_id, plan_key, product_key, payload }: { receipt_id?: string; plan_key?: string; product_key?: string, payload?: any }) => {
    deleteCookie('payment_state');
    if (receipt_id) {
      splunkInstance('dashboard').sendEvent({
        group: 'hamdast_payment',
        type: 'show_receipt',
        event: {
          is_doctor: info?.is_doctor,
          user_id: info?.id,
          meta_data: {
            app_key: app_key,
            product_key: product_key,
            receipt_id: receipt_id,
            center_id: selectedCenter
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
          product_key: product_key,
          plan_key: plan_key,
          ...(payload && { payload }),
        },
        {
          withCredentials: true,
        },
      )
      .then(data => {
        setReceiptData(data.data);
        sendEventLog("show_receipt")
        setIsLoading(false);
      });
  };



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
    gatewayWindow.current = window.open(`https://apigw.paziresh24.com/katibe/v1/topups?amount=${receiptData?.price}&returnlink=${encodeURIComponent(`https://www.paziresh24.com/_/${app_key}/payment_return_link/?status=success`)}&uuid=${uuidV4()}&cancel_returnlink=${encodeURIComponent(`https://www.paziresh24.com/_/${app_key}/payment_return_link/?status=cancel`)}&receipt_id=${receiptData?.receipt_id}&center_id=${selectedCenter}${selectedCenter != '5532' ? '&account=organization' : ''}`, '_blank');
  };


  const handlePayment = async () => {
    gatewayWindow.current?.close();
    setIsLoadingPayment(true);
    try {
      await payRequest.mutateAsync({
        id: receiptData?.receipt_id,
        centerid: selectedCenter != '5532' ? selectedCenter : undefined,
      });
      onSuccess({
        receipt_id: receiptData?.receipt_id, center_id: selectedCenter, product_key: receiptData?.product_key,
        plan_key: receiptData?.plan_key,
        is_auto_renew: isAutoRenew
      })
    } catch (error) {
      handleCancelPayment();
      if (isAxiosError(error)) {

        toast.error(error?.response?.data?.message || 'خطا در پرداخت');
        onError({
          receipt_id: receiptData?.receipt_id, center_id: selectedCenter, message: error?.response?.data?.message, product_key: receiptData?.product_key,
          plan_key: receiptData?.plan_key,
        })
      }
    } finally {
      handleClose();
      setIsLoadingPayment(false);
    }
  };

  const handleCancelPayment = () => {
    gatewayWindow.current?.close();
    onCancel({
      receipt_id: receiptData?.receipt_id, center_id: selectedCenter, product_key: receiptData?.product_key,
      plan_key: receiptData?.plan_key,
    })
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
        noHeader={true}
        noLine={fullScreen}
      >
        {isLoading && !fullScreen && <Loading />}
        {isLoading && fullScreen && !isLoadingPayment && <div className='flex flex-col gap-4 justify-center items-center'>
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
        {isLoading && fullScreen && isLoadingPayment && <div className='flex flex-col gap-4 justify-center items-center'>
          <div className='flex flex-col justify-center items-center gap-2'>
            <Loading />
            <span className='text-sm font-medium'>لطفا کمی صبر کنید</span>
            <Text fontSize='xs' className='text-center'>به زودی به طور خودکار به ابزارک {app_name} منتقل خواهید شد.</Text>
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
                    sortBy(info?.provider?.centers?.filter?.(center => center.id == "5532" || center.type_id == 1).map(item => ({ ...item, ...balances?.find((b: any) => b.center_id == item.id) })), 'balance')?.map?.((item, index) => (
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
                            {new Intl.NumberFormat('fa-IR').format((item?.balance ?? 0) / 10)}{' '}تومان
                          </Text>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
              <Divider />
              {
                showAutoRenew &&
                (
                  <>
                    <div className='flex gap-2 items-center border border-slate-200 p-2 rounded-lg'>
                      <Switch onChange={(e) => setIsAutoRenew(prev => !prev)} checked={isAutoRenew} />
                      <div className='flex flex-col cursor-pointer' onClick={() => setIsAutoRenew(prev => !prev)}>
                        <Text fontSize='sm' fontWeight='semiBold'>
                          تمدید خودکار
                        </Text>
                        <Text fontSize='xs' className='opacity-80'>
                          با فعال‌سازی، اشتراک شما در پایان دوره به‌صورت خودکار تمدید می‌شود.
                        </Text>
                      </div>
                    </div>
                    <Divider />
                  </>
                )
              }
              <Button variant="primary" size="sm" block loading={isLoadingPayment} onClick={handleCheckPayment} disabled={isLoadingBalances}>
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
});
