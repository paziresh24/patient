import Button from '@/common/components/atom/button';
import Modal from '@/common/components/atom/modal';
import Text from '@/common/components/atom/text';
import TextField from '@/common/components/atom/textField';
import useModal from '@/common/hooks/useModal';
import useResponsive from '@/common/hooks/useResponsive';
import { splunkInstance } from '@/common/services/splunk';
import optimizeLogging from '@/common/utils/optimizeLogging';
import { useLoginModalContext } from '@/modules/login/context/loginModal';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import { useState } from 'react';
import toast from 'react-hot-toast';

export const Report = ({ app_key, page_key }: { app_key: string; page_key: string }) => {
  const { handleOpen, handleClose, modalProps } = useModal();
  const [reportItemSelected, setReportItemSelected] = useState('empty');
  const [reason, setReason] = useState('');
  const user = useUserInfoStore(state => state.info);
  const isLogin = useUserInfoStore(state => state.isLogin);
  const { handleOpenLoginModal } = useLoginModalContext();
  const { isMobile } = useResponsive();

  const reportItems = [
    { label: 'باز می‌شود اما کار نمی‌کند.', value: 'openButNotWork' },
    { label: 'کار می‌کند اما پیچیده است.', value: 'workButComplex' },
    { label: 'ابزارک اصلاً باز نمی‌شود.', value: 'dontOpen' },
    { label: 'سایر', value: 'others' },
  ];

  const handleReportSubmit = (user_id?: string) => {
    if (user_id ? false : !isLogin) {
      handleOpenLoginModal({
        state: true,
        postLogin: userInfo => handleReportSubmit(userInfo?.id),
      });
      return;
    }
    optimizeLogging(() => {
      splunkInstance('dashboard').sendEvent({
        group: 'apps-report',
        type: 'apps-report',
        event: {
          report: reportItemSelected ?? 'empty',
          reason: reason,
          app_key: app_key,
          page_key: page_key,
          user_id: user_id ?? user?.id,
        },
      });
    });
    toast.success('گزارش شما با موفقیت ثبت شد.');
    handleClose();
  };

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        onClick={handleOpen}
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M12 7v2" />
        <path d="M12 13h.01" />
      </svg>
      <Modal {...modalProps} fullScreen={isMobile} title="گزارش مشکل">
        <div className="flex flex-col gap-6">
          <span className="font-semibold">در بارگزاری یا عملکرد ابزارک مشکل دارید؟</span>
          <span className="text-sm opacity-70">یکی از گزینه‌های زیر را انتخاب کنید و دکمه ثبت را بزنید.</span>

          <div className="flex flex-col gap-5">
            {reportItems?.map(item => (
              <label key={item.label} className="flex items-center cursor-pointer space-s-2">
                <input
                  checked={reportItemSelected === item?.value}
                  type="radio"
                  name="report"
                  onChange={e => {
                    e.target.checked && setReportItemSelected(item.value);
                  }}
                />
                <Text className="font-medium">{item.label}</Text>
              </label>
            ))}
          </div>
          {reportItemSelected != 'empty' && (
            <TextField onChange={e => setReason(e.target?.value)} multiLine className="h-36" placeholder="دلیل گزارش خود را بنویسید..." />
          )}
          <div className="fixed md:static md:p-0 md:border-none bottom-0 w-full right-0 p-5 bg-white border border-t border-slate-100">
            <Button className="w-full" disabled={reason.length == 0} onClick={() => handleReportSubmit()}>
              ثبت گزارش
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
