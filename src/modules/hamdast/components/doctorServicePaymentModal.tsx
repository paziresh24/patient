import Avatar from '@/common/components/atom/avatar';
import Button from '@/common/components/atom/button';
import Divider from '@/common/components/atom/divider';
import Loading from '@/common/components/atom/loading/loading';
import Modal from '@/common/components/atom/modal';
import Text from '@/common/components/atom/text';
import useModal from '@/common/hooks/useModal';
import classNames from '@/common/utils/classNames';
import axios from 'axios';
import { deleteCookie, getCookie } from 'cookies-next';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { v4 as uuidV4 } from 'uuid';

const TAX_RATE = 0.1;
/** Must match hamdast-payments doctor-service split */
const PLATFORM_PERCENT = 0.3;

function formatToman(rial: number) {
  return `${new Intl.NumberFormat('fa-IR').format(Math.round(rial / 10))} تومان`;
}

/**
 * Katibe charges: amount + (amount × platform_percent × platform_vat_percent).
 * Do NOT also inflate the receipt amount — that double-counts VAT.
 */
function platformVatAmount(baseAmount: number) {
  return Math.round(baseAmount * PLATFORM_PERCENT * TAX_RATE);
}

function readProviderName(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null;
  const obj = data as Record<string, unknown>;
  const provider = Array.isArray(obj.providers)
    ? (obj.providers[0] as { name?: string; family?: string } | undefined)
    : (obj as { name?: string; family?: string });

  if (!provider) return null;
  const name = provider.name?.trim();
  const family = provider.family?.trim();
  if (!name && !family) return null;
  return [name, family].filter(Boolean).join(' ');
}

export default forwardRef(
  (
    {
      app_key,
      app_name,
      onSuccess,
      onCancel,
    }: {
      app_key: string;
      app_name: string;
      onSuccess: (data: any) => void;
      onCancel: (data: any) => void;
      onError: (data: any) => void;
    },
    ref,
  ) => {
    const { handleClose, handleOpen, modalProps } = useModal({
      onClose: () => {
        handleCancelPayment();
      },
    });
    const [amount, setAmount] = useState<number>(0);
    const [doctorUserId, setDoctorUserId] = useState<string>('');
    const [doctorName, setDoctorName] = useState<string>('');
    const receiptIdRef = useRef<string>('');
    const [walletBalance, setWalletBalance] = useState<number>(0);
    const [isLoadingBalances, setIsLoadingBalances] = useState(true);
    const [isLoadingPayment, setIsLoadingPayment] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [fullScreen, setFullScreen] = useState(false);
    const intervalCloseRef = useRef<any>();
    const gatewayWindow = useRef<any>();

    const doctorAvatarSrc = doctorUserId ? `https://pic.paziresh24.com/api/image/${doctorUserId}` : undefined;
    const { taxAmount, payableAmount } = useMemo(() => {
      const tax = platformVatAmount(amount);
      return { taxAmount: tax, payableAmount: amount + tax };
    }, [amount]);
    const hasEnoughBalance = walletBalance >= payableAmount;

    useImperativeHandle(ref, () => ({
      open: (data: any) => {
        setAmount(data?.amount ?? 0);
        setDoctorUserId(data?.doctor_user_id ?? '');
        setDoctorName('');
        setWalletBalance(0);
        setIsLoading(true);
        setIsLoadingPayment(false);
        setFullScreen(false);
        handleOpen();
      },
    }));

    // Create receipt + load doctor profile when modal opens
    useEffect(() => {
      if (!modalProps.isOpen || !amount) return;

      receiptIdRef.current = '';
      let cancelled = false;

      // Receipt amount must be the BASE service amount.
      // Katibe adds platform VAT via platform_vat_percent on split.
      const receiptPromise = axios.post(
        `https://hamdast.paziresh24.com/api/v1/apps/${app_key}/billing/provider-service/receipts`,
        {
          amount: amount,
          provider_user_id: doctorUserId,
        },
        { withCredentials: true },
      );

      const doctorPromise = doctorUserId
        ? axios
            .get(`https://apigw.paziresh24.com/v1/providers?user_id=${encodeURIComponent(doctorUserId)}`)
            .then(res => readProviderName(res.data))
            .catch(() => null)
        : Promise.resolve(null);

      Promise.all([receiptPromise, doctorPromise])
        .then(([receiptRes, name]) => {
          if (cancelled) return;
          receiptIdRef.current = receiptRes.data.receipt_id;
          if (name) setDoctorName(name);
          setIsLoading(false);
        })
        .catch(() => {
          if (!cancelled) handleClose();
        });

      return () => {
        cancelled = true;
      };
    }, [modalProps.isOpen, doctorUserId, amount, app_key]);

    // Always use main p24 personal wallet
    useEffect(() => {
      if (!modalProps.isOpen) return;

      setIsLoadingBalances(true);
      axios
        .get('https://apigw.paziresh24.com/katibe/v1/transactions/balance/p24', {
          withCredentials: true,
        })
        .then(data => {
          setWalletBalance(+data.data.data.balance || 0);
        })
        .catch(error => {
          console.error(error);
          setWalletBalance(0);
        })
        .finally(() => {
          setIsLoadingBalances(false);
        });
    }, [modalProps.isOpen]);

    const handleDirectSuccess = useCallback(() => {
      setIsLoadingPayment(true);
      axios
        .post(
          `https://hamdast.paziresh24.com/api/v1/apps/${app_key}/billing/provider-service/pay`,
          { receipt_id: receiptIdRef.current },
          { withCredentials: true },
        )
        .then(() => {
          onSuccess({ receipt_id: receiptIdRef.current });
        })
        .catch(() => {
          onSuccess({ receipt_id: receiptIdRef.current });
        })
        .finally(() => {
          setIsLoadingPayment(false);
          handleClose();
        });
    }, [onSuccess, app_key]);

    const handlePayViaGateway = useCallback(() => {
      setFullScreen(true);
      setIsLoadingPayment(false);
      gatewayWindow.current?.close();
      deleteCookie('payment_state');
      const topupUuid = uuidV4();
      gatewayWindow.current = window.open(
        `https://apigw.paziresh24.com/katibe/v1/topups?amount=${payableAmount}&returnlink=${encodeURIComponent(
          `https://www.paziresh24.com/_/${app_key}/payment_return_link/?status=success`,
        )}&uuid=${topupUuid}&cancel_returnlink=${encodeURIComponent(
          `https://www.paziresh24.com/_/${app_key}/payment_return_link/?status=cancel`,
        )}&receipt_id=${receiptIdRef.current}`,
        '_blank',
      );
    }, [payableAmount, app_key]);

    useEffect(() => {
      if (fullScreen) {
        intervalCloseRef.current = setInterval(() => {
          if (!getCookie('payment_state')) return;
          const status = getCookie('payment_state')?.toString().includes('success');
          gatewayWindow.current?.close();
          deleteCookie('payment_state');

          if (status) {
            handleDirectSuccess();
          } else {
            handleCancelPayment();
          }
        });

        return () => {
          clearInterval(intervalCloseRef.current);
        };
      }
    }, [fullScreen, handleDirectSuccess]);

    const handleCheckPayment = () => {
      setIsLoadingPayment(true);

      if (hasEnoughBalance) {
        handleDirectSuccess();
      } else {
        handlePayViaGateway();
      }
    };

    const handleCancelPayment = () => {
      gatewayWindow.current?.close();
      setIsLoadingPayment(false);
      onCancel({ receipt_id: receiptIdRef.current });
      handleClose();
    };

    return (
      <div>
        <Modal
          bodyClassName="justify-center flex-col flex items-center"
          {...modalProps}
          fullScreen={fullScreen}
          onClose={fullScreen ? () => {} : modalProps.onClose}
          title="پرداخت"
          noHeader={true}
          noLine={fullScreen}
        >
          {isLoading && !fullScreen && <Loading />}
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
                <Button size="sm" block onClick={handleDirectSuccess} loading={isLoadingPayment}>
                  پرداخت را انجام دادم
                </Button>
                <Button size="sm" block variant="text" onClick={handleCancelPayment}>
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
          {!isLoading && !fullScreen && (
            <div className="w-full flex flex-col gap-3">
              <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white">
                {/* Payee */}
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <Avatar
                    src={doctorAvatarSrc}
                    name={doctorName || 'پزشک'}
                    width={48}
                    height={48}
                    className="rounded-full min-w-12"
                  />
                  <div className="flex flex-col min-w-0">
                    <Text fontSize="sm" fontWeight="bold" className="line-clamp-1 text-slate-900">
                      {doctorName || 'پزشک'}
                    </Text>
                    <Text fontSize="xs" className="text-slate-500 line-clamp-1">
                      {app_name}
                    </Text>
                  </div>
                </div>

                <div className="mx-4 border-t border-dashed border-slate-200" />

                {/* Line items */}
                <div className="flex flex-col gap-2.5 px-4 py-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <Text fontSize="sm" className="text-slate-500">
                      مبلغ خدمت
                    </Text>
                    <Text fontSize="sm" fontWeight="medium" className="tabular-nums text-slate-800">
                      {formatToman(amount)}
                    </Text>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <Text fontSize="sm" className="text-slate-500">
                      مالیات بر ارزش افزوده ۱۰٪
                    </Text>
                    <Text fontSize="sm" fontWeight="medium" className="tabular-nums text-slate-800">
                      {formatToman(taxAmount)}
                    </Text>
                  </div>
                </div>

                <div className="mx-4 border-t border-dashed border-slate-200" />

                {/* Total */}
                <div className="flex items-center justify-between gap-3 px-4 py-3.5 bg-slate-50/80">
                  <Text fontSize="sm" fontWeight="bold" className="text-slate-900">
                    مبلغ قابل پرداخت
                  </Text>
                  <Text fontSize="base" fontWeight="bold" className="tabular-nums text-primary">
                    {formatToman(payableAmount)}
                  </Text>
                </div>

                {/* Wallet footnote */}
                <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-t border-slate-100">
                  <Text fontSize="xs" className="text-slate-500">
                    کسر از کیف پول
                  </Text>
                  <Text
                    fontSize="xs"
                    fontWeight="medium"
                    className={classNames(
                      'tabular-nums',
                      isLoadingBalances ? 'text-slate-400' : hasEnoughBalance ? 'text-slate-600' : 'text-red-500',
                    )}
                  >
                    {isLoadingBalances ? '...' : `موجودی ${formatToman(walletBalance)}`}
                  </Text>
                </div>
              </div>

              {!isLoadingBalances && !hasEnoughBalance && (
                <Text fontSize="xs" className="text-slate-500 px-0.5">
                  موجودی کافی نیست؛ ابتدا کیف پول شارژ می‌شود.
                </Text>
              )}

              <Button
                variant="primary"
                size="sm"
                block
                loading={isLoadingPayment}
                onClick={handleCheckPayment}
                disabled={isLoadingBalances}
              >
                {hasEnoughBalance ? `پرداخت ${formatToman(payableAmount)}` : 'افزایش موجودی و پرداخت'}
              </Button>
            </div>
          )}
        </Modal>
      </div>
    );
  },
);
