import Loading from '@/common/components/atom/loading/loading';
import Modal from '@/common/components/atom/modal';
import Button from '@/common/components/atom/button/button';
import useModal from '@/common/hooks/useModal';
import { splunkInstance } from '@/common/services/splunk';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import axios from 'axios';
import { deleteCookie, getCookie } from 'cookies-next';
import { forwardRef, useImperativeHandle, useEffect, useRef, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import classNames from 'classnames';
import Payment from './payment';

interface PlanData {
  id: string;
  key: string;
  title: string;
  interval: string;
  trial_period: number;
  amount: number;
  user_usages: Array<{
    id: string;
    plan: string;
    is_trial_period: boolean;
    subscription_at: string;
    ending_at: string;
    canceled_at: string;
    terminated_at: string;
  }>;
}

interface PlanListItem {
  id: string;
  key?: string;
  title: string;
  interval: string;
  amount: number;
  trial_period: number;
}

export interface HamdastSubscriptionPaymentRef {
  open: (plan_key?: string, payload?: any, hash_id?: string, receipt_id?: string) => Promise<{ success: boolean; plan_key?: string }>;
  close: () => void;
}

interface HamdastSubscriptionPaymentProps {
  app_key: string;
  app_name: string;
  iframeRef: any;
  icon: string
}

export const HamdastSubscriptionPayment = forwardRef<HamdastSubscriptionPaymentRef, HamdastSubscriptionPaymentProps>(
  ({ app_key, app_name, icon, iframeRef }, ref) => {
    const { isLogin, info } = useUserInfoStore();
    const { handleOpenLoginModal } = useLoginModalContext();
    const [isLoading, setIsLoading] = useState(true);
    const [planData, setPlanData] = useState<PlanData | null>(null);
    const [showPlanSelection, setShowPlanSelection] = useState(false);
    const [showPlansList, setShowPlansList] = useState(false);
    const [plansList, setPlansList] = useState<PlanListItem[]>([]);
    const [isSubscribing, setIsSubscribing] = useState(false);
    const payment = useRef<any>(null)
    const { handleClose, handleOpen, modalProps } = useModal({
      onClose: () => {
        const currentData = { ...subscriptionData.current };
        sendCancelEvent();
        subscriptionPromiseRef.current?.resolve({ success: false, plan_key: currentData?.plan_key });
        subscriptionPromiseRef.current = null;
        resetStates();
      },
    });
    const subscriptionPromiseRef = useRef<{
      resolve: (value: { success: boolean; plan_key?: string }) => void;
      reject: (reason?: any) => void;
    } | null>(null);
    const subscriptionData = useRef<any>({});

    const resetStates = useCallback(() => {
      setIsLoading(true);
      setPlanData(null);
      setShowPlanSelection(false);
      setShowPlansList(false);
      setPlansList([]);
      subscriptionData.current = {};
    }, []);

    const sendEvent = useCallback(
      (event: 'HAMDAST_PAYMENT_SUBSCRIBE_CANCEL' | 'HAMDAST_PAYMENT_SUBSCRIBE_SUCCESS' | 'HAMDAST_PAYMENT_SUBSCRIBE_ERROR', data?: any) => {
        const currentData = subscriptionData.current;
        if (!currentData?.hash_id && !currentData?.plan_key && !data?.plan_key) return;

        iframeRef.current?.contentWindow?.postMessage(
          {
            hamdast: {
              event,
              action: 'forwardToApp',
              data: {
                event,
                payload: currentData?.payload,
                plan_key: currentData?.plan_key || data?.plan_key,
                receipt_id: currentData?.receipt_id || data?.receipt_id,
                ...(data || {}),
              },
              hash_id: currentData?.hash_id || data?.hash_id,
            },
          },
          '*',
        );
      },
      [iframeRef],
    );

    const sendCancelEvent = useCallback(() => {
      sendEvent('HAMDAST_PAYMENT_SUBSCRIBE_CANCEL');
    }, [sendEvent]);

    const sendSuccessEvent = useCallback(
      (plan_key?: string) => {
        sendEvent('HAMDAST_PAYMENT_SUBSCRIBE_SUCCESS', { plan_key });
      },
      [sendEvent],
    );


    useImperativeHandle(
      ref,
      () => ({
        open: (
          plan_key?: string,
        ): Promise<{ success: boolean; plan_key?: string }> => {
          return new Promise((resolve, reject) => {
            subscriptionPromiseRef.current = { resolve, reject };
            resetStates();
            subscriptionData.current = { plan_key };

            const handleOpenWithLogin = (callback: () => void) => {
              if (!isLogin) {
                handleOpenLoginModal({
                  state: true,
                  postLogin: callback,
                  onClose: () => {
                    sendCancelEvent();
                    subscriptionPromiseRef.current?.resolve({ success: false, plan_key });
                    subscriptionPromiseRef.current = null;
                  },
                });
                return;
              }
              handleOpen();
              callback();
            };

            if (plan_key) {
              handleOpenWithLogin(() => fetchPlanData(plan_key));
            } else {
              handleOpenWithLogin(() => fetchPlansList());
            }
          });
        },
        close: handleClose,
      }),
      [isLogin, handleOpen, handleClose, handleOpenLoginModal, resetStates, sendCancelEvent],
    );


    const checkActiveSubscription = async (): Promise<{
      hasActive: boolean;
      activeSubscription: any;
      history: any[];
    }> => {
      try {
        const response = await axios.get(`https://apigw.paziresh24.com/v1/hamdast/apps/${app_key}/subscriptions`, {
          withCredentials: true,
        });
        return {
          hasActive: response.data?.has_active_subscription || false,
          activeSubscription: response.data?.active_subscription || null,
          history: response.data?.history || [],
        };
      } catch (error) {
        console.error('Error checking active subscription:', error);
        return {
          hasActive: false,
          activeSubscription: null,
          history: [],
        };
      }
    };

    const handleActiveSubscription = useCallback(
      (subscriptionInfo: { activeSubscription?: any }) => {
        handleClose();
        const plan_key = subscriptionData.current?.plan_key || subscriptionInfo.activeSubscription?.plan_key;
        sendSuccessEvent(plan_key);
        subscriptionPromiseRef.current?.resolve({ success: true, plan_key });
        subscriptionPromiseRef.current = null;
      },
      [handleClose, sendSuccessEvent],
    );

    const fetchPlansList = async () => {
      try {
        setIsLoading(true);
        const subscriptionInfo = await checkActiveSubscription();

        if (subscriptionInfo.hasActive) {
          return handleActiveSubscription(subscriptionInfo);
        }

        const response = await axios.get(`https://apigw.paziresh24.com/v1/hamdast/apps/${app_key}/plans/`, {
          withCredentials: true,
        });
        const plans = response.data?.items || [];

        if (plans.length === 0) {
          toast.error('پلنی برای این اپلیکیشن یافت نشد');
          setIsLoading(false);
          sendCancelEvent();
          handleClose();
          return;
        }

        if (plans.length === 1) {
          const planKey = plans[0].key || plans[0].id;
          subscriptionData.current = { ...subscriptionData.current, plan_key: planKey };
          fetchPlanData(planKey);
          return;
        }

        setPlansList(plans);
        setShowPlansList(true);
        setShowPlanSelection(false);
        setIsLoading(false);
      } catch (error: any) {
        console.error('Error fetching plans:', error);
        toast.error(error?.response?.data?.message || 'خطا در دریافت لیست پلن‌ها');
        setIsLoading(false);
        sendCancelEvent();
        handleClose();
      }
    };



    const fetchPlanData = async (plan_key: string) => {
      try {
        setIsLoading(true);

        const subscriptionInfo = await checkActiveSubscription();

        if (subscriptionInfo.hasActive) {
          return handleActiveSubscription(subscriptionInfo);
        }

        const planResponse = await axios.get(`https://apigw.paziresh24.com/v1/hamdast/apps/${app_key}/plans/${plan_key}`, {
          withCredentials: true,
        });
        setPlanData(planResponse.data);
        setIsLoading(false);

        const hasTrial = subscriptionInfo.history.some((sub: any) => sub.is_trial_period === true);
        const hasTrialPeriod = planResponse.data.trial_period > 0;
        const hasNoSubscription = subscriptionInfo.history.length === 0;
        if (hasTrial) {
          setShowPlanSelection(false);
          setShowPlansList(false);
          openAndCreateReceipt();
        } else if (hasNoSubscription && hasTrialPeriod) {
          setShowPlanSelection(true);
          setShowPlansList(false);
        } else {
          setShowPlanSelection(false);
          setShowPlansList(false);
          openAndCreateReceipt();
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'خطا در دریافت اطلاعات پلن');
        setIsLoading(false);
        sendCancelEvent();
        handleClose();
      }
    };

    const openAndCreateReceipt = () => {
      payment.current?.open({ plan_key: subscriptionData.current?.plan_key })
      handleClose();
      setShowPlanSelection(false);
      setShowPlansList(false);
    };

    const logSplunkEvent = (type: string, extraData?: any) => {
      splunkInstance('dashboard').sendEvent({
        group: 'hamdast_subscription_payment',
        type,
        event: {
          is_doctor: info?.is_doctor,
          user_id: info?.id,
          meta_data: {
            app_key,
            plan_key: subscriptionData.current?.plan_key,
            ...extraData,
          },
        },
      });
    };

    const subscribeToPlan = async (receipt_id: string, is_auto_renew?: boolean) => {
      try {
        await axios.post(
          `https://apigw.paziresh24.com/v1/hamdast/apps/${app_key}/plans/${subscriptionData.current?.plan_key}/subscribe`,
          { receipt_id, auto_renew: is_auto_renew },
          { withCredentials: true },
        );
        sendSuccessEvent();
        subscriptionPromiseRef.current?.resolve({ success: true, plan_key: subscriptionData.current?.plan_key });
        subscriptionPromiseRef.current = null;
        handleClose();
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'خطا در فعال‌سازی اشتراک');
        sendEvent('HAMDAST_PAYMENT_SUBSCRIBE_ERROR', { message: error?.response?.data?.message });
        handleClose();
      }
    };

    const activateTrialPeriod = async () => {
      setIsSubscribing(true);
      try {
        await axios.post(
          `https://apigw.paziresh24.com/v1/hamdast/apps/${app_key}/plans/${subscriptionData.current?.plan_key}/subscribe`,
          { trial: true },
          { withCredentials: true },
        );
        logSplunkEvent('trial_activated');
        sendSuccessEvent();
        subscriptionPromiseRef.current?.resolve({ success: true, plan_key: subscriptionData.current?.plan_key });
        subscriptionPromiseRef.current = null;
        handleClose();
        toast.success('دوره آزمایشی با موفقیت فعال شد');
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'خطا در فعال‌سازی دوره آزمایشی');
        logSplunkEvent('trial_error', { message: error?.response?.data?.message });
        sendCancelEvent();
      } finally {
        setIsSubscribing(false);
      }
    };

    const handlePaymentSuccess = ({ receipt_id, center_id, is_auto_renew }: any) => {
      logSplunkEvent('success_receipt', { receipt_id, center_id });
      subscribeToPlan(receipt_id, is_auto_renew);
    };

    const handleCancelPayment = ({ receipt_id, center_id }: any) => {
      logSplunkEvent('cancel_receipt', { receipt_id, center_id });
      sendCancelEvent();
      subscriptionPromiseRef.current?.resolve({ success: false, plan_key: subscriptionData.current?.plan_key });
      subscriptionPromiseRef.current = null;
      handleClose();
    };

    const handlePaymentError = ({ message, receipt_id, center_id }: any) => {
      logSplunkEvent('error_receipt', { message, center_id, receipt_id });
      sendEvent('HAMDAST_PAYMENT_SUBSCRIBE_ERROR', { message });
      handleClose();
    };


    useEffect(() => {
      const handleEventFunction = (messageEvent: MessageEvent) => {
        if (messageEvent.data?.hamdast?.event === 'HAMDAST_PAYMENT_SUBSCRIBE') {
          setIsLoading(true);
          setShowPlanSelection(false);
          setShowPlansList(false);
          subscriptionData.current = {
            hash_id: messageEvent.data?.hamdast?.hash_id,
            plan_key: messageEvent.data?.hamdast?.data?.plan_key,
          };

          const plan_key = subscriptionData.current?.plan_key;
          const handleOpenWithLogin = (callback: () => void) => {
            if (!isLogin) {
              return handleOpenLoginModal({
                state: true,
                postLogin: callback,
                onClose: sendCancelEvent,
              });
            }
            handleOpen();
            callback();
          };

          if (plan_key) {
            handleOpenWithLogin(() => fetchPlanData(plan_key));
          } else {
            handleOpenWithLogin(() => fetchPlansList());
          }
        }



      };

      window.addEventListener('message', handleEventFunction);
      return () => window.removeEventListener('message', handleEventFunction);
    }, [isLogin, handleOpen, handleClose, handleOpenLoginModal, sendCancelEvent, sendSuccessEvent, sendEvent, modalProps.isOpen, payment]);

    const getIntervalText = (interval: string) => {
      const intervals: Record<string, string> = {
        monthly: 'ماهانه',
        quarterly: 'سه ماهه',
        semiannual: 'شش ماهه',
        yearly: 'سالانه',
        weekly: 'هفتگی',
      };
      return intervals[interval] || interval;
    };

    const formatPrice = (amount: number) => {
      const tomanAmount = amount / 10;
      return new Intl.NumberFormat('fa-IR').format(tomanAmount) + ' تومان';
    };

    const handleSelectPlan = (planKeyOrId: string) => {
      setShowPlansList(false);
      setShowPlanSelection(false);
      subscriptionData.current = { ...subscriptionData.current, plan_key: planKeyOrId };
      fetchPlanData(planKeyOrId);
    };

    return (
      <div>
        <Modal
          noHeader
          bodyClassName={classNames('justify-center flex items-center')}
          {...modalProps}
          onClose={modalProps.onClose}
        >
          {isLoading && <Loading />}
          {!isLoading && showPlansList && plansList.length > 0 && !showPlanSelection && (
            <div className="flex-grow flex flex-col overflow-y-auto">
              <div className="border-b border-slate-200 pb-4 mb-4">
                <span className="font-bold text-lg">{app_name}</span>
                <p className="text-sm text-slate-600 mt-1">لطفاً یک پلن را انتخاب کنید</p>
              </div>
              <div className="flex flex-col gap-3">
                {plansList.map(plan => (
                  <div
                    key={plan.id}
                    className="border border-slate-200 rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
                    onClick={() => handleSelectPlan(plan.key || plan.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-sm">{plan.title}</span>
                        <span className="bg-slate-100 rounded-md text-xs text-slate-700 font-medium p-1 px-3 w-fit">
                          {getIntervalText(plan.interval)}
                        </span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-lg">{formatPrice(plan.amount)}</span>
                        {plan.trial_period > 0 && <span className="text-xs text-primary">دوره آزمایشی {plan.trial_period} روزه</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="primary" block className="bg-slate-200 text-slate-700 border-0 mt-4" onClick={handleCancelPayment}>
                لغو و بازگشت
              </Button>
            </div>
          )}
          {!isLoading && showPlanSelection && planData && !showPlansList && (
            <div className="flex-grow flex flex-col px-4">
              <div className="border-b border-slate-200 pb-4">
                <span className="font-bold">{app_name}</span>
                <div className="flex flex-wrap gap-1 items-center">
                  <span className="text-sm font-semibold">{planData.title}</span>
                  <span className="bg-slate-100 rounded-md text-xs text-slate-700 font-medium p-1 px-3">
                    {getIntervalText(planData.interval)}
                  </span>
                </div>
              </div>
              <div>
                <div className="py-4">
                  <p className="font-extrabold line-through decoration-2 decoration-slate-500 text-sm">{formatPrice(planData.amount)}</p>
                  <p className="font-extrabold text-2xl">{formatPrice(0)}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 border-t border-slate-200 pt-4">
                <Button variant="primary" block onClick={activateTrialPeriod} loading={isSubscribing} disabled={isSubscribing}>
                  فعال‌سازی دوره آزمایشی{' '}
                  <span className="text-xs bg-white rounded-full text-primary p-1 px-3">{planData.trial_period} روز رایگان</span>
                </Button>
                <Button variant="primary" block className="bg-slate-200 text-slate-700 border-0" onClick={handleCancelPayment}>
                  لغو و بازگشت
                </Button>
              </div>
            </div>
          )}
        </Modal>
        <Payment showAutoRenew={true} icon={icon} app_key={app_key} app_name={app_name} onSuccess={handlePaymentSuccess} onCancel={handleCancelPayment} onError={handlePaymentError} ref={payment} />
      </div>
    );
  },
);

HamdastSubscriptionPayment.displayName = 'HamdastSubscriptionPayment';
