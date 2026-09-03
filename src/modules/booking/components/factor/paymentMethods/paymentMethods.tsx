import Accordion from '@/common/components/atom/accordion/accordion';
import Text from '@/common/components/atom/text';
import clsx from 'clsx';
import { useState, useEffect } from 'react';

interface PaymentMethodsProps {
  paymentMethods: any[];
  additionalContent: string;
  isOpen?: boolean;
  selectedPaymentMethod?: string;
  onSelectionChange?: (paymentMethod: string) => void;
  /** payment_method keys that stay visible but cannot be selected */
  disabledPaymentMethods?: string[];
}

export const PaymentMethods = (props: PaymentMethodsProps) => {
  const {
    paymentMethods,
    additionalContent,
    isOpen = false,
    selectedPaymentMethod,
    onSelectionChange,
    disabledPaymentMethods = [],
  } = props;
  const [selectedMethod, setSelectedMethod] = useState(selectedPaymentMethod || paymentMethods?.[0]?.payment_method);
  const disabledSet = new Set(disabledPaymentMethods.map(m => String(m).toLowerCase()));

  useEffect(() => {
    if (selectedPaymentMethod) {
      setSelectedMethod(selectedPaymentMethod);
    } else if (paymentMethods?.[0]?.payment_method && !selectedMethod) {
      setSelectedMethod(paymentMethods[0].payment_method);
    }
  }, [selectedPaymentMethod, paymentMethods, selectedMethod]);

  const isDisabled = (method: string) => disabledSet.has(String(method || '').toLowerCase());

  const handleSelect = (method: string) => {
    if (isDisabled(method)) return;
    setSelectedMethod(method);
    onSelectionChange?.(method);
  };

  return (
    <Accordion title="روش پرداخت" isOpen={isOpen} className="px-1 !bg-white rounded-none md:rounded-lg shadow-card">
      <div className="flex flex-col space-y-3">
        {paymentMethods?.map(item => {
          const disabled = isDisabled(item.payment_method);
          const selected = selectedMethod === item.payment_method;
          return (
            <div
              key={item.payment_method}
              onClick={() => handleSelect(item.payment_method)}
              aria-disabled={disabled}
              className={clsx('flex flex-col border rounded-lg transition-all duration-200 overflow-hidden bg-white', {
                'cursor-pointer': !disabled,
                'cursor-not-allowed opacity-50': disabled,
                'border-green-500': selected && !disabled,
                'border-slate-200 hover:border-slate-300': !selected && !disabled,
                'border-slate-200': disabled,
              })}
            >
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3 flex-1 overflow-hidden">
                  {item.logo && (
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                      <img src={item.logo} alt={item.title} className="w-full h-full object-contain" />
                    </div>
                  )}
                  <div className="w-full flex flex-col gap-1 min-w-0">
                    <Text fontWeight="bold" fontSize="sm" className="truncate text-slate-900">
                      {item.title}
                    </Text>
                    {item.html_content && selected && (
                      <div className="w-full text-xs text-slate-500 [&>p]:m-0" dangerouslySetInnerHTML={{ __html: item.html_content }} />
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {item.display_amount && (
                    <Text
                      fontWeight="medium"
                      fontSize="sm"
                      className={clsx({
                        'text-green-600': selected && !disabled,
                        'text-slate-500': !selected || disabled,
                      })}
                    >
                      {item.display_amount}
                    </Text>
                  )}
                  <div
                    className={clsx('flex items-center justify-center w-5 h-5 rounded-full border', {
                      'bg-green-500 border-green-500': selected && !disabled,
                      'border-slate-300 bg-white': !selected || disabled,
                    })}
                  >
                    {selected && !disabled && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.25 4L3.75 6.5L8.75 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
              {item.additional_html && (
                <div className="w-full text-slate-600 [&>p]:m-0" dangerouslySetInnerHTML={{ __html: item.additional_html }} />
              )}
            </div>
          );
        })}
        {additionalContent && <div className="w-full text-slate-600 [&>p]:m-0" dangerouslySetInnerHTML={{ __html: additionalContent }} />}
      </div>
    </Accordion>
  );
};
export default PaymentMethods;
