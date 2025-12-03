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
}

export const HamdastSubscriptionPayment = forwardRef<HamdastSubscriptionPaymentRef, HamdastSubscriptionPaymentProps>(
  ({ app_key, app_name, iframeRef }, ref) => {
    const { handleClose, handleOpen, modalProps } = useModal({
      onClose: () => {
        iframeRef.current?.contentWindow?.postMessage(
          {
            hamdast: {
              event: 'HAMDAST_PAYMENT_SUBSCRIBE_CANCEL',
              action: 'forwardToApp',
              data: {
                event: 'HAMDAST_PAYMENT_SUBSCRIBE_CANCEL',
                payload: subscriptionData.current?.payload,
                plan_key: subscriptionData.current?.plan_key,
              },
              hash_id: subscriptionData.current?.hash_id,
            },
          },
          '*',
        );
        subscriptionPromiseRef.current?.resolve({ success: false, plan_key: subscriptionData.current?.plan_key });
        subscriptionPromiseRef.current = null;
        resetStates();
      },
    });
    const { isLogin, info } = useUserInfoStore();
    const { handleOpenLoginModal } = useLoginModalContext();

    const [isLoading, setIsLoading] = useState(true);
    const [id, setId] = useState<string | null>(null);
    const [fullScreen, setFullScreen] = useState(false);
    const [planData, setPlanData] = useState<PlanData | null>(null);
    const [showPlanSelection, setShowPlanSelection] = useState(false);
    const [showPlansList, setShowPlansList] = useState(false);
    const [plansList, setPlansList] = useState<PlanListItem[]>([]);
    const [isSubscribing, setIsSubscribing] = useState(false);
    const intervalCloseRef = useRef<any>();
    const subscriptionPromiseRef = useRef<{
      resolve: (value: { success: boolean; plan_key?: string }) => void;
      reject: (reason?: any) => void;
    } | null>(null);

    const subscriptionData = useRef<any>({});

    const resetStates = useCallback(() => {
      setIsLoading(true);
      setId(null);
      setFullScreen(false);
      setPlanData(null);
      setShowPlanSelection(false);
      setShowPlansList(false);
      setPlansList([]);
      subscriptionData.current = {};
    }, []);

    const checkActiveSubscription = async (): Promise<{
      hasActive: boolean;
      activeSubscription: any;
      history: any[];
    }> => {
      try {
        const response = await axios.get(`https://apigw.paziresh24.com/v1/hamdast/apps/${app_key}/subscriptions/`, {
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

    const fetchPlansList = async () => {
      try {
        setIsLoading(true);

        // بررسی اشتراک فعال
        const subscriptionInfo = await checkActiveSubscription();
        if (subscriptionInfo.hasActive) {
          // اگر اشتراک فعال دارد، modal را نمی‌بازیم و کاربر را به اپ هدایت می‌کنیم
          handleClose();
          // می‌توانیم یک postMessage به iframe بفرستیم که کاربر را به اپ هدایت کند
          iframeRef.current?.contentWindow?.postMessage(
            {
              hamdast: {
                event: 'HAMDAST_SUBSCRIPTION_ACTIVE',
                action: 'forwardToApp',
                data: {
                  event: 'HAMDAST_SUBSCRIPTION_ACTIVE',
                },
              },
            },
            '*',
          );
          return;
        }

        const response = await axios.get(`https://apigw.paziresh24.com/v1/hamdast/apps/${app_key}/plans/`, {
          withCredentials: true,
        });
        const plans = response.data?.items || [];

        if (plans.length === 0) {
          toast.error('پلنی برای این اپلیکیشن یافت نشد');
          setIsLoading(false);
          handleClose();
          return;
        }

        // اگر تنها یک پلن دارد، مستقیماً آن را باز می‌کنیم
        if (plans.length === 1) {
          const planKey = plans[0].key || plans[0].id;
          subscriptionData.current = {
            plan_key: planKey,
          };
          fetchPlanData(planKey);
          return;
        }

        // اگر بیشتر از یک پلن دارد، لیست را نمایش می‌دهیم
        setPlansList(plans);
        setShowPlansList(true);
        setIsLoading(false);
      } catch (error: any) {
        console.error('Error fetching plans:', error);
        toast.error(error?.response?.data?.message || 'خطا در دریافت لیست پلن‌ها');
        setIsLoading(false);
        handleClose();
      }
    };

    const fetchPlanData = async (plan_key: string) => {
      try {
        // بررسی اشتراک فعال
        const subscriptionInfo = await checkActiveSubscription();

        // اگر کاربر اشتراک فعال دارد، modal را نمی‌بازیم و کاربر را به اپ هدایت می‌کنیم
        if (subscriptionInfo.hasActive) {
          handleClose();
          iframeRef.current?.contentWindow?.postMessage(
            {
              hamdast: {
                event: 'HAMDAST_SUBSCRIPTION_ACTIVE',
                action: 'forwardToApp',
                data: {
                  event: 'HAMDAST_SUBSCRIPTION_ACTIVE',
                },
              },
            },
            '*',
          );
          return;
        }

        // دریافت اطلاعات پلن
        const planResponse = await axios.get(`https://apigw.paziresh24.com/v1/hamdast/apps/${app_key}/plans/${plan_key}`, {
          withCredentials: true,
        });
        setPlanData(planResponse.data);
        setIsLoading(false);

        const hasTrial = subscriptionInfo.history.some((sub: any) => sub.is_trial_period === true);
        const hasTrialPeriod = planResponse.data.trial_period > 0;
        const hasNoSubscription = subscriptionInfo.history.length === 0;

        // اگر trial را استفاده کرده، مستقیماً به پرداخت می‌رویم
        if (hasTrial) {
          setShowPlanSelection(false);
          setShowPlansList(false);
          openAndCreateReceipt();
        }
        // اگر کاربر تا بحال اشتراکی نداشته و پلن دارای دوره آزمایشی است، پاپ‌آپ trial را نشان می‌دهیم
        else if (hasNoSubscription && hasTrialPeriod) {
          setShowPlanSelection(true);
          setShowPlansList(false);
        }
        // در غیر این صورت، مستقیماً به پرداخت می‌رویم
        else {
          setShowPlanSelection(false);
          setShowPlansList(false);
          openAndCreateReceipt();
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'خطا در دریافت اطلاعات پلن');
        setIsLoading(false);
        handleClose();
      }
    };

    useImperativeHandle(
      ref,
      () => ({
        open: (
          plan_key?: string,
          payload?: any,
          hash_id?: string,
          receipt_id?: string,
        ): Promise<{ success: boolean; plan_key?: string }> => {
          return new Promise((resolve, reject) => {
            subscriptionPromiseRef.current = { resolve, reject };
            resetStates();
            if (plan_key) {
              subscriptionData.current = {
                plan_key,
                payload,
                hash_id,
                receipt_id,
              };
              if (!isLogin) {
                handleOpenLoginModal({
                  state: true,
                  postLogin(userInfo) {
                    handleOpen();
                    return fetchPlanData(plan_key);
                  },
                  onClose: () => {
                    iframeRef.current?.contentWindow?.postMessage(
                      {
                        hamdast: {
                          event: 'HAMDAST_PAYMENT_SUBSCRIBE_CANCEL',
                          action: 'forwardToApp',
                          data: {
                            event: 'HAMDAST_PAYMENT_SUBSCRIBE_CANCEL',
                            payload: subscriptionData.current?.payload,
                            plan_key: subscriptionData.current?.plan_key,
                            receipt_id: subscriptionData.current?.receipt_id,
                          },
                          hash_id: subscriptionData.current?.hash_id,
                        },
                      },
                      '*',
                    );
                    subscriptionPromiseRef.current?.resolve({ success: false, plan_key });
                    subscriptionPromiseRef.current = null;
                  },
                });
                return;
              }
              handleOpen();
              fetchPlanData(plan_key);
            } else {
              // اگر plan_key نداشتیم، لیست پلن‌ها را نمایش می‌دهیم
              if (!isLogin) {
                handleOpenLoginModal({
                  state: true,
                  postLogin(userInfo) {
                    handleOpen();
                    fetchPlansList();
                  },
                  onClose: () => {
                    // در صورت بستن، هیچ postMessage ای ارسال نمی‌کنیم چون plan_key نداریم
                    subscriptionPromiseRef.current?.resolve({ success: false });
                    subscriptionPromiseRef.current = null;
                  },
                });
                return;
              }
              handleOpen();
              fetchPlansList();
            }
          });
        },
        close: handleClose,
      }),
      [isLogin, handleOpen, handleClose, handleOpenLoginModal, app_key, iframeRef, resetStates],
    );

    const openAndCreateReceipt = () => {
      deleteCookie('payment_state', { domain: '.paziresh24.com', path: '/' });
      setShowPlanSelection(false);
      setShowPlansList(false);
      setIsLoading(true);
      if (subscriptionData.current?.receipt_id) {
        setId(subscriptionData.current?.receipt_id);
        splunkInstance('dashboard').sendEvent({
          group: 'hamdast_subscription_payment',
          type: 'show_receipt',
          event: {
            is_doctor: info?.is_doctor,
            user_id: info?.id,
            meta_data: {
              app_key: app_key,
              plan_key: subscriptionData.current?.plan_key,
              receipt_id: subscriptionData.current?.receipt_id,
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
            plan_key: subscriptionData.current?.plan_key,
            ...(subscriptionData.current?.payload && { payload: subscriptionData.current?.payload }),
          },
          {
            withCredentials: true,
          },
        )
        .then(data => {
          setId(data.data?.receipt_id);
          subscriptionData.current = {
            ...subscriptionData.current,
            receipt_id: data.data?.receipt_id,
          };
          splunkInstance('dashboard').sendEvent({
            group: 'hamdast_subscription_payment',
            type: 'show_receipt',
            event: {
              is_doctor: info?.is_doctor,
              user_id: info?.id,
              meta_data: {
                app_key: app_key,
                plan_key: subscriptionData.current?.plan_key,
                receipt_id: subscriptionData.current?.receipt_id,
              },
            },
          });
          setIsLoading(false);
        })
        .catch(error => {
          toast.error(error?.response?.data?.message || 'خطا در ایجاد فاکتور');
          setIsLoading(false);
          handleClose();
        });
    };

    const activateTrialPeriod = async () => {
      setIsSubscribing(true);
      try {
        await axios.post(
          `https://apigw.paziresh24.com/v1/hamdast/apps/${app_key}/plans/${subscriptionData.current?.plan_key}/subscribe`,
          {
            trial: true,
          },
          {
            withCredentials: true,
          },
        );
        splunkInstance('dashboard').sendEvent({
          group: 'hamdast_subscription_payment',
          type: 'trial_activated',
          event: {
            is_doctor: info?.is_doctor,
            user_id: info?.id,
            meta_data: {
              app_key: app_key,
              plan_key: subscriptionData.current?.plan_key,
            },
          },
        });
        iframeRef.current?.contentWindow?.postMessage(
          {
            hamdast: {
              event: 'HAMDAST_PAYMENT_SUBSCRIBE_SUCCESS',
              action: 'forwardToApp',
              data: {
                event: 'HAMDAST_PAYMENT_SUBSCRIBE_SUCCESS',
                payload: subscriptionData.current?.payload,
                plan_key: subscriptionData.current?.plan_key,
                trial: true,
              },
              hash_id: subscriptionData.current?.hash_id,
            },
          },
          '*',
        );
        subscriptionPromiseRef.current?.resolve({ success: true, plan_key: subscriptionData.current?.plan_key });
        subscriptionPromiseRef.current = null;
        handleClose();
        toast.success('دوره آزمایشی با موفقیت فعال شد');
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'خطا در فعال‌سازی دوره آزمایشی');
        splunkInstance('dashboard').sendEvent({
          group: 'hamdast_subscription_payment',
          type: 'trial_error',
          event: {
            is_doctor: info?.is_doctor,
            user_id: info?.id,
            meta_data: {
              app_key: app_key,
              plan_key: subscriptionData.current?.plan_key,
              message: error?.response?.data?.message,
            },
          },
        });
      } finally {
        setIsSubscribing(false);
      }
    };

    const handleSubscribe = () => {
      openAndCreateReceipt();
    };

    const handleCancelPayment = () => {
      clearInterval(intervalCloseRef.current);
      deleteCookie('payment_state', { domain: '.paziresh24.com', path: '/' });
      splunkInstance('dashboard').sendEvent({
        group: 'hamdast_subscription_payment',
        type: 'cancel_receipt',
        event: {
          is_doctor: info?.is_doctor,
          user_id: info?.id,
          meta_data: {
            app_key: app_key,
            plan_key: subscriptionData.current?.plan_key,
            receipt_id: subscriptionData.current?.receipt_id,
          },
        },
      });
      iframeRef.current?.contentWindow?.postMessage(
        {
          hamdast: {
            event: 'HAMDAST_PAYMENT_SUBSCRIBE_CANCEL',
            action: 'forwardToApp',
            data: {
              event: 'HAMDAST_PAYMENT_SUBSCRIBE_CANCEL',
              payload: subscriptionData.current?.payload,
              plan_key: subscriptionData.current?.plan_key,
            },
            hash_id: subscriptionData.current?.hash_id,
          },
        },
        '*',
      );
      subscriptionPromiseRef.current?.resolve({ success: false, plan_key: subscriptionData.current?.plan_key });
      subscriptionPromiseRef.current = null;
      handleClose();
    };

    useEffect(() => {
      let gatewayWindow: any;
      const handleEventFunction = (messageEvent: MessageEvent) => {
        console.log('HAMDAST_PAYMENT_SUBSCRIBE', messageEvent.data);
        if (messageEvent.data?.hamdast?.event === 'HAMDAST_PAYMENT_SUBSCRIBE') {
          setFullScreen(false);
          setIsLoading(true);
          setShowPlanSelection(false);
          setShowPlansList(false);
          subscriptionData.current = {
            hash_id: messageEvent.data?.hamdast?.hash_id,
            plan_key: messageEvent.data?.hamdast?.data?.plan_key,
            payload: messageEvent.data?.hamdast?.data?.payload,
            receipt_id: messageEvent.data?.hamdast?.data?.receipt_id,
          };

          if (!isLogin) {
            return handleOpenLoginModal({
              state: true,
              postLogin(userInfo) {
                handleOpen();
                return fetchPlanData(subscriptionData.current?.plan_key);
              },
              onClose: () => {
                iframeRef.current?.contentWindow?.postMessage(
                  {
                    hamdast: {
                      event: 'HAMDAST_PAYMENT_SUBSCRIBE_CANCEL',
                      action: 'forwardToApp',
                      data: {
                        event: 'HAMDAST_PAYMENT_SUBSCRIBE_CANCEL',
                        payload: subscriptionData.current?.payload,
                        plan_key: subscriptionData.current?.plan_key,
                        receipt_id: subscriptionData.current?.receipt_id,
                      },
                      hash_id: subscriptionData.current?.hash_id,
                    },
                  },
                  '*',
                );
              },
            });
          }

          handleOpen();
          fetchPlanData(subscriptionData.current?.plan_key);
        }

        if (messageEvent.data?.payman?.event === 'PAYMAN_PAYMENT_CANCEL') {
          handleCancelPayment();
        }

        if (messageEvent.data?.payman?.event === 'PAYMAN_PAYMENT_SUCCESS') {
          clearInterval(intervalCloseRef.current);
          deleteCookie('payment_state', { domain: '.paziresh24.com', path: '/' });
          if (gatewayWindow) {
            gatewayWindow?.close();
          }
          splunkInstance('dashboard').sendEvent({
            group: 'hamdast_subscription_payment',
            type: 'success_receipt',
            event: {
              is_doctor: info?.is_doctor,
              user_id: info?.id,
              meta_data: {
                app_key: app_key,
                plan_key: subscriptionData.current?.plan_key,
                receipt_id: subscriptionData.current?.receipt_id,
              },
            },
          });

          // Call subscribe endpoint after payment success
          axios
            .post(
              `https://apigw.paziresh24.com/v1/hamdast/apps/${app_key}/plans/${subscriptionData.current?.plan_key}/subscribe`,
              {
                receipt_id: subscriptionData.current?.receipt_id,
              },
              {
                withCredentials: true,
              },
            )
            .then(() => {
              iframeRef.current?.contentWindow?.postMessage(
                {
                  hamdast: {
                    event: 'HAMDAST_PAYMENT_SUBSCRIBE_SUCCESS',
                    action: 'forwardToApp',
                    data: {
                      event: 'HAMDAST_PAYMENT_SUBSCRIBE_SUCCESS',
                      payload: subscriptionData.current?.payload,
                      plan_key: subscriptionData.current?.plan_key,
                      receipt_id: subscriptionData.current?.receipt_id,
                    },
                    hash_id: subscriptionData.current?.hash_id,
                  },
                },
                '*',
              );
              subscriptionPromiseRef.current?.resolve({ success: true, plan_key: subscriptionData.current?.plan_key });
              subscriptionPromiseRef.current = null;
              handleClose();
            })
            .catch(error => {
              toast.error(error?.response?.data?.message || 'خطا در فعال‌سازی اشتراک');
              iframeRef.current?.contentWindow?.postMessage(
                {
                  hamdast: {
                    event: 'HAMDAST_PAYMENT_SUBSCRIBE_ERROR',
                    action: 'forwardToApp',
                    data: {
                      event: 'HAMDAST_PAYMENT_SUBSCRIBE_ERROR',
                      payload: subscriptionData.current?.payload,
                      plan_key: subscriptionData.current?.plan_key,
                      message: error?.response?.data?.message,
                    },
                    hash_id: subscriptionData.current?.hash_id,
                  },
                },
                '*',
              );
              handleClose();
            });
        }

        if (messageEvent.data?.payman?.event === 'PAYMAN_PAYMENT_ERROR') {
          clearInterval(intervalCloseRef.current);
          deleteCookie('payment_state', { domain: '.paziresh24.com', path: '/' });
          if (gatewayWindow) {
            gatewayWindow?.close();
          }
          toast.error(messageEvent.data?.payman?.data?.message);
          splunkInstance('dashboard').sendEvent({
            group: 'hamdast_subscription_payment',
            type: 'error_receipt',
            event: {
              is_doctor: info?.is_doctor,
              user_id: info?.id,
              meta_data: {
                app_key: app_key,
                plan_key: subscriptionData.current?.plan_key,
                receipt_id: subscriptionData.current?.receipt_id,
                message: messageEvent.data?.payman?.data?.message,
              },
            },
          });
          iframeRef.current?.contentWindow?.postMessage(
            {
              hamdast: {
                event: 'HAMDAST_PAYMENT_SUBSCRIBE_ERROR',
                action: 'forwardToApp',
                data: {
                  event: 'HAMDAST_PAYMENT_SUBSCRIBE_ERROR',
                  payload: subscriptionData.current?.payload,
                  plan_key: subscriptionData.current?.plan_key,
                  message: messageEvent.data?.payman?.data?.message,
                },
                hash_id: subscriptionData.current?.hash_id,
              },
            },
            '*',
          );
          handleClose();
        }

        if (messageEvent.data?.payman?.event === 'PAYMAN_PAYMENT_OPEN_GATEWAY') {
          const gatewayLink = messageEvent.data?.payman?.data?.gateway_link || '';
          if (gatewayLink) {
            gatewayWindow = window.open(gatewayLink, '_blank');
            setFullScreen(true);
            splunkInstance('dashboard').sendEvent({
              group: 'hamdast_subscription_payment',
              type: 'open_gateway',
              event: {
                is_doctor: info?.is_doctor,
                user_id: info?.id,
                meta_data: {
                  app_key: app_key,
                  plan_key: subscriptionData.current?.plan_key,
                  receipt_id: subscriptionData.current?.receipt_id,
                },
              },
            });

            intervalCloseRef.current = setInterval(() => {
              if (!getCookie('payment_state', { domain: '.paziresh24.com', path: '/' })) return;
              const status = getCookie('payment_state', { domain: '.paziresh24.com', path: '/' })?.toString().includes('SUCCESS');

              if (status) {
                splunkInstance('dashboard').sendEvent({
                  group: 'hamdast_subscription_payment',
                  type: 'success_receipt',
                  event: {
                    is_doctor: info?.is_doctor,
                    user_id: info?.id,
                    meta_data: {
                      app_key: app_key,
                      plan_key: subscriptionData.current?.plan_key,
                      receipt_id: subscriptionData.current?.receipt_id,
                    },
                  },
                });

                // Call subscribe endpoint after payment success
                axios
                  .post(
                    `https://apigw.paziresh24.com/v1/hamdast/apps/${app_key}/plans/${subscriptionData.current?.plan_key}/subscribe`,
                    {
                      receipt_id: subscriptionData.current?.receipt_id,
                    },
                    {
                      withCredentials: true,
                    },
                  )
                  .then(() => {
                    iframeRef.current?.contentWindow?.postMessage(
                      {
                        hamdast: {
                          event: 'HAMDAST_PAYMENT_SUBSCRIBE_SUCCESS',
                          action: 'forwardToApp',
                          data: {
                            event: 'HAMDAST_PAYMENT_SUBSCRIBE_SUCCESS',
                            payload: subscriptionData.current?.payload,
                            plan_key: subscriptionData.current?.plan_key,
                            receipt_id: subscriptionData.current?.receipt_id,
                          },
                          hash_id: subscriptionData.current?.hash_id,
                        },
                      },
                      '*',
                    );
                    subscriptionPromiseRef.current?.resolve({ success: true, plan_key: subscriptionData.current?.plan_key });
                    subscriptionPromiseRef.current = null;
                  })
                  .catch(error => {
                    toast.error(error?.response?.data?.message || 'خطا در فعال‌سازی اشتراک');
                    iframeRef.current?.contentWindow?.postMessage(
                      {
                        hamdast: {
                          event: 'HAMDAST_PAYMENT_SUBSCRIBE_ERROR',
                          action: 'forwardToApp',
                          data: {
                            event: 'HAMDAST_PAYMENT_SUBSCRIBE_ERROR',
                            payload: subscriptionData.current?.payload,
                            plan_key: subscriptionData.current?.plan_key,
                            message: error?.response?.data?.message,
                          },
                          hash_id: subscriptionData.current?.hash_id,
                        },
                      },
                      '*',
                    );
                  });
              }

              if (!status) {
                toast.error(messageEvent.data?.payman?.data?.message);
                splunkInstance('dashboard').sendEvent({
                  group: 'hamdast_subscription_payment',
                  type: 'error_receipt',
                  event: {
                    is_doctor: info?.is_doctor,
                    user_id: info?.id,
                    meta_data: {
                      app_key: app_key,
                      plan_key: subscriptionData.current?.plan_key,
                      receipt_id: subscriptionData.current?.receipt_id,
                      message: messageEvent.data?.payman?.data?.message,
                    },
                  },
                });
                iframeRef.current?.contentWindow?.postMessage(
                  {
                    hamdast: {
                      event: 'HAMDAST_PAYMENT_SUBSCRIBE_ERROR',
                      action: 'forwardToApp',
                      data: {
                        event: 'HAMDAST_PAYMENT_SUBSCRIBE_ERROR',
                        payload: subscriptionData.current?.payload,
                        plan_key: subscriptionData.current?.plan_key,
                      },
                      hash_id: subscriptionData.current?.hash_id,
                    },
                  },
                  '*',
                );
              }

              handleClose();
              deleteCookie('payment_state', { domain: '.paziresh24.com', path: '/' });
              clearInterval(intervalCloseRef.current);
            }, 1000);
          }
        }
      };
      window.addEventListener('message', handleEventFunction);

      return () => {
        window.removeEventListener('message', handleEventFunction);
      };
    }, [isLogin]);

    const getIntervalText = (interval: string) => {
      switch (interval) {
        case 'monthly':
          return 'ماهانه';
        case 'yearly':
          return 'سالانه';
        case 'weekly':
          return 'هفتگی';
        case 'daily':
          return 'روزانه';
        default:
          return interval;
      }
    };

    const formatPrice = (amount: number) => {
      // تبدیل از ریال به تومان (1 تومان = 10 ریال)
      const tomanAmount = amount / 10;
      return new Intl.NumberFormat('fa-IR').format(tomanAmount) + ' تومان';
    };

    const handleSelectPlan = (planKeyOrId: string) => {
      setShowPlansList(false);
      subscriptionData.current = {
        plan_key: planKeyOrId,
      };
      fetchPlanData(planKeyOrId);
    };

    return (
      <div>
        <Modal
          noHeader
          bodyClassName={classNames('px-0 justify-center flex items-center', {
            'h-[22.5rem]': !showPlanSelection && !showPlansList,
          })}
          {...modalProps}
          fullScreen={fullScreen}
          onClose={fullScreen ? () => {} : modalProps.onClose}
        >
          {isLoading && <Loading />}
          {!isLoading && showPlansList && plansList.length > 0 && (
            <div className="flex-grow flex flex-col px-4 py-4 max-h-[80vh] overflow-y-auto">
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
                        <span className="font-semibold">{plan.title}</span>
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
          {!isLoading && showPlanSelection && planData && (
            <div className="flex-grow flex flex-col px-4">
              {/* Header Section */}
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
                  <p className=" font-extrabold line-through decoration-2 decoration-slate-500 text-sm">{formatPrice(planData.amount)}</p>
                  <p className=" font-extrabold text-2xl">{formatPrice(0)}</p>
                </div>
              </div>

              {/* Divider */}
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
          {!isLoading && !showPlanSelection && id && (
            <iframe className="w-full h-[22.5rem]" src={`https://pay.paziresh24.com/${id}?embeded=true`} />
          )}
        </Modal>
      </div>
    );
  },
);

HamdastSubscriptionPayment.displayName = 'HamdastSubscriptionPayment';
