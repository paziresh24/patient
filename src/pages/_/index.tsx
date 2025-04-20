import { LayoutWithHeaderAndFooter } from '@/common/components/layouts/layoutWithHeaderAndFooter';
import { withServerUtils } from '@/common/hoc/withServerUtils';
import { ThemeConfig } from '@/common/hooks/useCustomize';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ReactElement, useEffect, useState } from 'react';
import LauncherMain from '.plasmic/LauncherMain';
import GlobalContextsProvider from '.plasmic/plasmic/launcher/PlasmicGlobalContextsProvider';
import Seo from '@/common/components/layouts/seo';
import CloseIcon from '@/common/components/icons/close';
import useModal from '@/common/hooks/useModal';
import Modal from '@/common/components/atom/modal';
import Button from '@/common/components/atom/button';
import TextField from '@/common/components/atom/textField';
import { splunkInstance } from '@/common/services/splunk';
import { useUserInfoStore } from '@/modules/login/store/userInfo';
import toast from 'react-hot-toast';

const Page = () => {
  const { handleOpen, handleClose, modalProps } = useModal();
  const { handleOpen: handleReasonOpen, handleClose: handleReasonClose, modalProps: reaonModalProps } = useModal();
  const [reason, setReason] = useState('');
  const info = useUserInfoStore(state => state.info);
  const [dontShowBanner, setDontShowBanner] = useState(
    typeof window == 'undefined' ? true : !!window?.localStorage?.getItem?.('dont-show-launcher-intro-banner'),
  );

  useEffect(() => {
    window?.clarity?.('upgrade', 'LauncherMain');
  }, []);

  return (
    <>
      <Seo title="خدمات" noIndex />
      {info?.provider?.job_title === 'doctor' && !dontShowBanner && (
        <div className="p-3 bg-zinc-200  cursor-pointer font-medium text-xs flex items-center justify-between">
          <span onClick={handleOpen}>
            اینجا کجاست؟ <span className="underline underline-offset-4 font-semibold">بیشتر درمورد این صفحه بدانید.</span>
          </span>
          <CloseIcon
            className="w-4 h-4"
            onClick={() => {
              setDontShowBanner(true);
              localStorage.setItem('dont-show-launcher-intro-banner', 'true');
            }}
          />
        </div>
      )}
      <Modal {...modalProps} noHeader>
        <div className="flex flex-col gap-5 items-center">
          <img src="https://notioly.com/wp-content/uploads/2022/07/153.Mention.png" alt="" className="w-60 h-40 object-cover" />
          <div className="flex flex-col gap-2">
            <span className="w-full text-sm font-medium">
              به میزکار <span className="text-primary">حرفه‌ای ها</span> خوش آمدید!
            </span>
            <span className="font-medium text-justify">
              این صفحه به گونه‌ای طراحی شده که دسترسی شما به امکانات مهم سریع‌تر و راحت‌تر باشد. شما می‌توانید از ابزارک‌ها برای دسترسی به
              ابزارهای حرفه‌ای‌تر استفاده کنید و همچنین به راحتی به بخش‌های مختلف مانند مراجعین من و ساعت کاری و... دسترسی داشته باشید.
            </span>
          </div>

          <Button className="w-full" size="sm" onClick={handleClose}>
            باشه، متوجه شدم!
          </Button>
          <div className="flex flex-col gap-2 opacity-80">
            <span className="text-sm">
              اگر احساس می‌کنید به داشبورد قدیمی نیاز دارید، می‌توانید با استفاده از دکمه زیر به آن بازگشت داشته باشید.
            </span>
            <Button onClick={handleReasonOpen} className="w-full" size="sm" variant="secondary">
              بازگشت به داشبورد قدیم
            </Button>
          </div>
        </div>
      </Modal>
      <Modal {...reaonModalProps} noHeader>
        <div className="flex flex-col gap-3">
          <span className="font-medium">دلیل بازگشت شما به داشبورد قدیم چیست؟</span>
          <TextField
            onChange={e => setReason(e.target.value)}
            multiLine
            className="h-20"
            placeholder="اگر بازگشت به داشبورد قدیم به دلیل نیاز به امکانات خاص است، توضیح دهید…"
          />
          <Button
            onClick={() => {
              if (!reason) {
                return toast.error('لطفا دلیل خود را از بازگشت بنویسید.');
              }
              splunkInstance('dashboard').sendEvent({
                group: 'back-to-dashboard-reason',
                type: 'back-to-dashboard-reason',
                event: {
                  resaon: reason,
                  user_id: info?.id,
                  provider: info?.provider,
                },
              });
              localStorage.setItem('use-dashboard', info?.id!);
              location.replace('/dashboard/');
            }}
            className="w-full"
            variant="primary"
          >
            بازگشت به داشبورد قدیم
          </Button>
        </div>
      </Modal>
      <GlobalContextsProvider>
        <LauncherMain />
      </GlobalContextsProvider>
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutWithHeaderAndFooter {...page.props.config} className="bg-[#F2F3F5]" shouldShowPromoteApp={false} showFooter={false}>
      {page}
    </LayoutWithHeaderAndFooter>
  );
};
export const getServerSideProps: GetServerSideProps = withServerUtils(
  async (context: GetServerSidePropsContext, themeConfing: ThemeConfig) => {
    return {};
  },
);

export default Page;
