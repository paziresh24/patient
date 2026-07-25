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
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useEffectOnce } from 'react-use';
import { v4 as uuidV4 } from 'uuid';
import { usePayRequest } from '../apis/pay';
import sortBy from 'lodash/sortBy';
import Switch from '@/common/components/atom/switch';

const PAYMENT_STATE_COOKIE = 'payment_state';
const PAYMENT_STATE_STORAGE_KEY = 'hamdast_payment_state';
const PAYMENT_STATE_MESSAGE = 'hamdast_payment_state';

const ONLINE_VISIT_CENTER_ID = '5532';
/** Paziresh24 center type: مطب */
const OFFICE_CENTER_TYPE_ID = 1;

function isOnlineVisitCenter(center: { id?: unknown }) {
  return String(center?.id) === ONLINE_VISIT_CENTER_ID;
}

function getPaymentReturnUrls(appKey: string) {
  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://www.paziresh24.com';
  const base = `${origin}/_/${appKey}/payment_return_link/`;
  return {
    success: `${base}?hamdast_status=success&status=success`,
    cancel: `${base}?hamdast_status=cancel&status=cancel`,
  };
}

function readStoredPaymentState(): string | undefined {
  const cookie = getCookie(PAYMENT_STATE_COOKIE);
  if (cookie != null && String(cookie)) return String(cookie);

  try {
    const raw = localStorage.getItem(PAYMENT_STATE_STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as { status?: string; at?: number };
    if (!parsed?.status) return undefined;
    if (parsed.at && Date.now() - parsed.at > 15 * 60 * 1000) return undefined;
    return String(parsed.status);
  } catch {
    return undefined;
  }
}

function clearStoredPaymentState() {
  deleteCookie(PAYMENT_STATE_COOKIE, { path: '/' });
  try {
    localStorage.removeItem(PAYMENT_STATE_STORAGE_KEY);
  } catch {
    // ignore
  }
}

function isPaymentSuccessStatus(raw: unknown): boolean {
  const values = (Array.isArray(raw) ? raw : raw != null ? [raw] : [])
    .map(v => String(v).trim().toLowerCase())
    .filter(Boolean);

  return values.some(
    v =>
      v.includes('success') ||
      v === 'true' ||
      v === 'ok' ||
      v === 'paid' ||
      v === '1' ||
      v === 'done' ||
      v === 'complete' ||
      v === 'completed',
  );
}

function isPaymentCancelStatus(raw: unknown): boolean {
  const values = (Array.isArray(raw) ? raw : raw != null ? [raw] : [])
    .map(v => String(v).trim().toLowerCase())
    .filter(Boolean);

  return values.some(
    v =>
      v.includes('cancel') ||
      v === 'false' ||
      v === 'failed' ||
      v === 'fail' ||
      v === '0' ||
      v.includes('error'),
  );
}

export default forwardRef(
  (
    {
      app_key,
      app_name,
      icon,
      onSuccess,
      onCancel,
      onError,
      showAutoRenew,
      /** Skip center/receipt UI: pick richest center and pay (or topup then pay). */
      autoPay = false,
    }: {
      app_key: string;
      app_name: string;
      icon?: string;
      onSuccess: (data: any) => void;
      onCancel: (data: any) => void;
      onError: (data: any) => void;
      showAutoRenew?: Boolean;
      autoPay?: boolean;
    },
    ref,
  ) => {
    const { handleClose, handleOpen, modalProps } = useModal({
      onClose: () => {
        handleCancelPayment();
      },
    });
    const { info } = useUserInfoStore();
    const [balances, setBalances] = useState<any>([]);
    const [selectedCenter, setSelectedCenter] = useState(balances?.[balances?.length - 1]?.center_id);
    const [isLoadingBalances, setIsLoadingBalances] = useState(true);
    const [isLoadingPayment, setIsLoadingPayment] = useState(false);
    const payRequest = usePayRequest();
    const [isLoading, setIsLoading] = useState(true);
    const [fullScreen, setFullScreen] = useState(false);
    const intervalCloseRef = useRef<any>();
    const [receiptData, setReceiptData] = useState<any>(null);
    const gatewayWindow = useRef<any>();
    const [isAutoRenew, setIsAutoRenew] = useState(true);
    const autoPayTriggeredRef = useRef(false);
    const paymentHandledRef = useRef(false);
    const handlePaymentRef = useRef<() => void>(() => {});
    const handleCancelPaymentRef = useRef<() => void>(() => {});

    const allProviderCenters = useMemo(() => info?.provider?.centers ?? [], [info?.provider?.centers]);

    /** Payment wallets: مطب (type 1) only; 5532 added separately as ویزیت آنلاین. */
    const orgPaymentCenters = useMemo(() => {
      const centerTypeId = (center: any): number | null => {
        const raw = center?.type_id ?? center?.center_type;
        const n = Number(raw);
        return Number.isFinite(n) ? n : null;
      };

      return allProviderCenters.filter((center: any) => {
        if (isOnlineVisitCenter(center)) return false;
        return centerTypeId(center) === OFFICE_CENTER_TYPE_ID;
      });
    }, [allProviderCenters]);

    const onlineVisitCenter = useMemo(
      () => allProviderCenters.find(isOnlineVisitCenter) ?? null,
      [allProviderCenters],
    );

    /** SMS autoPay only: if no org center, pay from online visit (5532) when present. */
    const autoPayCenters = useMemo(() => {
      if (orgPaymentCenters.length > 0) return orgPaymentCenters;
      return onlineVisitCenter ? [onlineVisitCenter] : [];
    }, [orgPaymentCenters, onlineVisitCenter]);

    /**
     * Wallet UI sources:
     * - org present → all org centers + 5532 if linked
     * - only 5532 → online visit wallet
     * - neither → personal p24 (empty → fetch personal balance)
     */
    const walletCenters = useMemo(() => {
      if (orgPaymentCenters.length > 0) {
        const list = [...orgPaymentCenters];
        if (onlineVisitCenter) {
          list.push(onlineVisitCenter);
        }
        return list;
      }
      if (onlineVisitCenter) {
        return [onlineVisitCenter];
      }
      return [];
    }, [orgPaymentCenters, onlineVisitCenter]);

    const walletRows = useMemo(() => {
      if (autoPay) return [];

      if (walletCenters.length > 0) {
        const onlyOnlineVisitWallet =
          orgPaymentCenters.length === 0 && walletCenters.length === 1 && isOnlineVisitCenter(walletCenters[0]);

        return sortBy(
          walletCenters.map((item: any) => ({
            id: item.id,
            name: isOnlineVisitCenter(item)
              ? onlyOnlineVisitWallet
                ? 'کیف پول ویزیت آنلاین'
                : item.name?.trim() || 'ویزیت آنلاین'
              : item.name?.trim() || 'کیف پول',
            address: item.address,
            balance: balances.find((b: any) => b.center_id == item.id)?.balance ?? 0,
          })),
          'balance',
        );
      }

      const personal = balances.find((b: any) => b.center_id == null);
      return [
        {
          id: undefined as string | undefined,
          name: 'کیف پول شخصی',
          address: undefined as string | undefined,
          balance: personal?.balance ?? 0,
        },
      ];
    }, [autoPay, walletCenters, orgPaymentCenters.length, balances]);

    const showWalletSection = !autoPay && !isLoading;
    /** Online visit (5532) uses personal p24 wallet — Katibe pay must not receive centerid. */
    const shouldSendCenter = (centerId?: string) =>
      !!centerId && String(centerId) !== ONLINE_VISIT_CENTER_ID;

    useImperativeHandle(ref, () => ({
      open: (data: any) => {
        autoPayTriggeredRef.current = false;
        paymentHandledRef.current = false;
        setFullScreen(false);
        if (data?.preOpenedGatewayWindow) {
          gatewayWindow.current = data.preOpenedGatewayWindow;
        }
        handleOpen();
        setIsLoading(true);
        openAndCreateReceipt({
          ...data,
        });
      },
    }));

    useEffect(() => {
      if (app_key === 'khedmat') {
        setIsAutoRenew(true);
      }
    }, [app_key]);

    useEffect(() => {
      if (!modalProps.isOpen) return;

      const centersToLoad = autoPay
        ? orgPaymentCenters.length > 0
          ? orgPaymentCenters
          : autoPayCenters.length > 0
            ? autoPayCenters
            : null
        : walletCenters.length > 0
          ? walletCenters
          : null;

      if (!centersToLoad) {
        setIsLoadingBalances(true);
        axios
          .get('https://apigw.paziresh24.com/katibe/v1/transactions/balance/p24', {
            withCredentials: true,
          })
          .then(data => {
            setBalances([{ center_id: null, balance: +data.data.data.balance }]);
            setSelectedCenter(undefined);
          })
          .catch(error => {
            console.error(error);
            setBalances([]);
            setSelectedCenter(undefined);
          })
          .finally(() => {
            setIsLoadingBalances(false);
          });
        return;
      }
      setIsLoadingBalances(true);
      Promise.all(
        centersToLoad.map((item: any) =>
          axios
            .get(
              `https://apigw.paziresh24.com/katibe/v1/transactions/balance/p24${
                item.id == '5532' ? `` : `?centerid=${item.id}&account=organization`
              }`,
              {
                withCredentials: true,
              },
            )
            .then(data => ({
              center_id: item.id,
              balance: data.data.data.balance,
            })),
        ),
      )
        .then(data => {
          const sortedBalances = sortBy(
            data.map((item: any) => ({
              center_id: item.center_id,
              balance: +item.balance,
            })),
            'balance',
          );
          setBalances(sortedBalances);
          setSelectedCenter(sortedBalances?.[sortedBalances?.length - 1]?.center_id);
          setIsLoadingBalances(false);
        })
        .catch(error => {
          console.error(error);
          setIsLoadingBalances(false);
        })
        .finally(() => {
          setIsLoadingBalances(false);
        });
    }, [modalProps.isOpen, orgPaymentCenters, autoPayCenters, walletCenters, autoPay]);

    const sendEventLog = (type: 'show_receipt' | 'success' | 'cancel' | 'open_gateway') => {
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
            ...(shouldSendCenter(selectedCenter) && { center_id: selectedCenter }),
          },
        },
      });
    };

    const openAndCreateReceipt = ({
      receipt_id,
      plan_key,
      product_key,
      payload,
    }: {
      receipt_id?: string;
      plan_key?: string;
      product_key?: string;
      payload?: any;
    }) => {
      deleteCookie(PAYMENT_STATE_COOKIE, { path: '/' });
      try {
        localStorage.removeItem(PAYMENT_STATE_STORAGE_KEY);
      } catch {
        // ignore
      }
      if (receipt_id) {
        axios
          .get(`https://apigw.paziresh24.com/katibe/v1/payments/${receipt_id}`, {
            withCredentials: true,
          })
          .then(data => {
            setReceiptData({
              receipt_id: receipt_id,
              title: data.data?.data?.title,
              price: data.data?.data?.amount,
              ...(payload && { payload }),
            });
            sendEventLog('show_receipt');
            setIsLoading(false);
          });

        return;
      }
      axios
        .post(
          `https://hamdast.paziresh24.com/api/v1/apps/${app_key}/billing/receipts/`,
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
          sendEventLog('show_receipt');
          setIsLoading(false);
        });
    };

    const handleCheckPayment = () => {
      const selectedBalance =
        balances.find((balance: any) => balance.center_id == selectedCenter)?.balance ??
        balances.find((balance: any) => balance.center_id == null)?.balance ??
        0;

      if (selectedBalance >= receiptData?.price) {
        setIsLoadingPayment(true);
        handlePaymentRef.current();
      } else {
        handleIncreaseBalance();
      }
    };

    // Silent pay: richest center already selected via sorted balances; fire once ready.
    useEffect(() => {
      if (!autoPay || !modalProps.isOpen) return;
      if (isLoading || isLoadingBalances || !receiptData?.receipt_id || !receiptData?.price) return;
      if (autoPayTriggeredRef.current) return;
      autoPayTriggeredRef.current = true;
      handleCheckPayment();
    }, [
      autoPay,
      modalProps.isOpen,
      isLoading,
      isLoadingBalances,
      receiptData?.receipt_id,
      receiptData?.price,
      selectedCenter,
      balances,
    ]);

    const consumeGatewayResult = useCallback((rawStatus: unknown) => {
      if (paymentHandledRef.current) return;
      if (rawStatus == null || rawStatus === '') return;

      const success = isPaymentSuccessStatus(rawStatus);
      const cancel = isPaymentCancelStatus(rawStatus);
      if (!success && !cancel) return;

      paymentHandledRef.current = true;
      clearStoredPaymentState();
      gatewayWindow.current?.close();

      if (success) {
        handlePaymentRef.current();
      } else {
        handleCancelPaymentRef.current();
      }
    }, []);

    const pollGatewayState = useCallback(() => {
      const paymentState = readStoredPaymentState();
      if (!paymentState) return;
      consumeGatewayResult(paymentState);
    }, [consumeGatewayResult]);

    useEffect(() => {
      // Match doctorServicePaymentModal: wait UI is driven by fullScreen alone.
      if (!fullScreen) return;

      paymentHandledRef.current = false;
      intervalCloseRef.current = setInterval(pollGatewayState, 400);

      const onMessage = (event: MessageEvent) => {
        const data = event.data;
        if (!data || data.type !== PAYMENT_STATE_MESSAGE) return;
        consumeGatewayResult(data.status);
      };

      const onStorage = (event: StorageEvent) => {
        if (event.key !== PAYMENT_STATE_STORAGE_KEY || !event.newValue) return;
        try {
          const parsed = JSON.parse(event.newValue) as { status?: string };
          if (parsed?.status) consumeGatewayResult(parsed.status);
        } catch {
          consumeGatewayResult(event.newValue);
        }
      };

      const onFocus = () => pollGatewayState();
      const onVisibility = () => {
        if (document.visibilityState === 'visible') pollGatewayState();
      };

      window.addEventListener('message', onMessage);
      window.addEventListener('storage', onStorage);
      window.addEventListener('focus', onFocus);
      document.addEventListener('visibilitychange', onVisibility);
      pollGatewayState();

      return () => {
        clearInterval(intervalCloseRef.current);
        window.removeEventListener('message', onMessage);
        window.removeEventListener('storage', onStorage);
        window.removeEventListener('focus', onFocus);
        document.removeEventListener('visibilitychange', onVisibility);
      };
    }, [fullScreen, pollGatewayState, consumeGatewayResult]);

    const handleIncreaseBalance = () => {
      setFullScreen(true);
      setIsLoading(true);
      setIsLoadingPayment(false);
      paymentHandledRef.current = false;
      clearStoredPaymentState();

      const returns = getPaymentReturnUrls(app_key);
      const topupUrl = `https://apigw.paziresh24.com/katibe/v1/topups?amount=${receiptData?.price}&returnlink=${encodeURIComponent(
        returns.success,
      )}&uuid=${uuidV4()}&cancel_returnlink=${encodeURIComponent(returns.cancel)}&receipt_id=${
        receiptData?.receipt_id
      }${
        shouldSendCenter(selectedCenter)
          ? selectedCenter === '5532'
            ? `&center_id=${selectedCenter}`
            : `&center_id=${selectedCenter}&account=organization`
          : ''
      }`;

      // Prefer navigating a window opened during the user click (avoids popup blockers).
      const existing = gatewayWindow.current;
      if (existing && !existing.closed) {
        try {
          existing.location.href = topupUrl;
          return;
        } catch {
          try {
            existing.close();
          } catch {
            // ignore
          }
        }
      }

      gatewayWindow.current = window.open(topupUrl, 'hamdast_rasan_topup');
      if (!gatewayWindow.current) {
        toast.error('لطفاً اجازهٔ باز شدن پنجره پرداخت را در مرورگر بدهید.');
      }
    };

    const handlePayment = async () => {
      gatewayWindow.current?.close();
      setIsLoadingPayment(true);
      try {
        await payRequest.mutateAsync({
          id: receiptData?.receipt_id,
          centerid: shouldSendCenter(selectedCenter) ? selectedCenter : undefined,
        });
        onSuccess({
          receipt_id: receiptData?.receipt_id,
          ...(shouldSendCenter(selectedCenter) && { center_id: selectedCenter }),
          product_key: receiptData?.product_key,
          plan_key: receiptData?.plan_key,
          is_auto_renew: isAutoRenew,
        });
      } catch (error) {
        handleCancelPaymentRef.current();
        if (isAxiosError(error)) {
          toast.error(error?.response?.data?.message || 'خطا در پرداخت');
          onError({
            receipt_id: receiptData?.receipt_id,
            ...(shouldSendCenter(selectedCenter) && { center_id: selectedCenter }),
            message: error?.response?.data?.message,
            product_key: receiptData?.product_key,
            plan_key: receiptData?.plan_key,
          });
        }
      } finally {
        handleClose();
        setIsLoadingPayment(false);
        setFullScreen(false);
      }
    };

    const handleCancelPayment = () => {
      gatewayWindow.current?.close();
      clearStoredPaymentState();
      onCancel({
        receipt_id: receiptData?.receipt_id,
        ...(shouldSendCenter(selectedCenter) && { center_id: selectedCenter }),
        product_key: receiptData?.product_key,
        plan_key: receiptData?.plan_key,
      });
      handleClose();
      setFullScreen(false);
      setIsLoadingPayment(false);
    };

    handlePaymentRef.current = () => {
      void handlePayment();
    };
    handleCancelPaymentRef.current = handleCancelPayment;

    return (
      <div>
        <Modal
          bodyClassName="justify-center flex-col flex items-center"
          {...modalProps}
          fullScreen={fullScreen}
          onClose={fullScreen || (autoPay && isLoadingPayment) ? () => {} : modalProps.onClose}
          title="پرداخت"
          noHeader={true}
          noLine={fullScreen}
        >
          {autoPay && !fullScreen && (
            <div className="flex flex-col gap-3 items-center justify-center py-8 px-4">
              <Loading />
              <span className="text-sm font-medium text-slate-700">در حال پرداخت…</span>
            </div>
          )}
          {isLoading && !fullScreen && !autoPay && <Loading />}
          {fullScreen && !isLoadingPayment && (
            <div className="flex flex-col gap-4 justify-center items-center">
              <div className="flex flex-col justify-center items-center gap-2">
                <Loading />
                <span className="text-sm font-medium">درحال انتظار برای پرداخت</span>
                <Text fontSize="xs" className="text-center">
                  پس از پرداخت، خودکار به ابزارک {app_name} منتقل خواهید شد.
                </Text>
              </div>
              <Divider />
              <div className="flex flex-col gap-3 w-60">
                <Text fontSize="xs" className="text-center">
                  اگر هنوز منتقل نشدید، روی دکمه‌های زیر بزنید.
                </Text>
                <Button
                  size="sm"
                  block
                  onClick={() => {
                    paymentHandledRef.current = true;
                    clearStoredPaymentState();
                    void handlePayment();
                  }}
                  loading={isLoadingPayment}
                >
                  پرداخت را انجام دادم
                </Button>
                <Button
                  size="sm"
                  block
                  variant="text"
                  onClick={() => {
                    paymentHandledRef.current = true;
                    handleCancelPayment();
                  }}
                >
                  از پرداخت منصرف شدم
                </Button>
              </div>
            </div>
          )}
          {fullScreen && isLoadingPayment && (
            <div className="flex flex-col gap-4 justify-center items-center">
              <div className="flex flex-col justify-center items-center gap-2">
                <Loading />
                <span className="text-sm font-medium">لطفا کمی صبر کنید</span>
                <Text fontSize="xs" className="text-center">
                  به زودی به طور خودکار به ابزارک {app_name} منتقل خواهید شد.
                </Text>
              </div>
            </div>
          )}
          {!isLoading && !autoPay && (
            <div className="w-full flex flex-col gap-3">
              <div className="flex justify-between items-center pl-3">
                <div className="flex items-center gap-2">
                  <img src={icon} className="w-12 h-12 min-w-12 object-cover rounded-md border border-slate-100" />
                  <div className="flex flex-col">
                    <Text fontSize="base" fontWeight="bold" className="line-clamp-1">
                      {receiptData?.title}
                    </Text>
                    <Text fontSize="sm" className="opacity-80">
                      {app_name}
                    </Text>
                  </div>
                </div>
                <Text fontSize="base" fontWeight="bold" className="min-w-fit max-w-fit w-full">
                  {new Intl.NumberFormat('fa-IR').format(receiptData?.price / 10)} تومان
                </Text>
              </div>
              <Divider />
              {showWalletSection && (
                <div className="flex flex-col gap-3">
                  <Text fontSize="sm" fontWeight="semiBold">
                    {walletRows.length > 1
                      ? 'پول از حساب کدام مرکزدرمانی شما کسر شود؟'
                      : 'پرداخت از کیف پول'}
                  </Text>
                  <div className="flex flex-col gap-2">
                    {walletRows.map(item => {
                      const selected =
                        walletRows.length === 1 ||
                        selectedCenter == item.id ||
                        (item.id === undefined && selectedCenter == null);
                      return (
                        <div
                          key={item.id ?? 'personal-p24'}
                          onClick={() => {
                            if (walletRows.length === 1) return;
                            setSelectedCenter(item.id);
                          }}
                          className={classNames('flex flex-col border border-slate-300 rounded-md p-3', {
                            'border-primary border-2': selected,
                            'cursor-pointer': walletRows.length > 1,
                          })}
                        >
                          <div className="flex items-center gap-1">
                            <Text fontSize="xs" fontWeight="medium" className="min-w-fit max-w-fit w-full">
                              {item.name}
                            </Text>
                            {item.address && item.id !== ONLINE_VISIT_CENTER_ID && (
                              <Text className="line-clamp-1 text-[10px] max-w-full opacity-50">
                                ({item.address})
                              </Text>
                            )}
                          </div>
                          <div>
                            <Text fontSize="sm" fontWeight="medium" className="text-primary">
                              موجودی:{' '}
                            </Text>
                            <Text fontSize="sm" fontWeight="medium" className="text-primary">
                              {new Intl.NumberFormat('fa-IR').format((item.balance ?? 0) / 10)} تومان
                            </Text>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {showWalletSection && <Divider />}
              {showAutoRenew && (
                <>
                  <div className="flex gap-2 items-center border border-slate-200 p-2 rounded-lg">
                    <Switch onChange={e => setIsAutoRenew(prev => !prev)} checked={isAutoRenew} />
                    <div className="flex flex-col cursor-pointer" onClick={() => setIsAutoRenew(prev => !prev)}>
                      <Text fontSize="sm" fontWeight="semiBold">
                        تمدید خودکار <span className="text-primary text-xs">({isAutoRenew ? 'فعال' : 'غیر فعال'})</span>
                      </Text>
                      <Text fontSize="xs" className="opacity-80">
                        اشتراک شما در پایان دوره به‌صورت خودکار تمدید می‌شود.
                      </Text>
                    </div>
                  </div>
                  <Divider />
                </>
              )}
              <Button
                variant="primary"
                size="sm"
                block
                loading={isLoadingPayment}
                onClick={handleCheckPayment}
                disabled={isLoadingBalances}
              >
                {(() => {
                  const payBalance =
                    balances.find((balance: any) => balance.center_id == selectedCenter)?.balance ??
                    balances.find((balance: any) => balance.center_id == null)?.balance ??
                    0;
                  return payBalance >= receiptData?.price ? 'پرداخت' : 'افزایش موجودی و پرداخت';
                })()}
              </Button>
            </div>
          )}
        </Modal>
      </div>
    );
  },
);
