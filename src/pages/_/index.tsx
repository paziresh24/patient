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
import { AppFrame } from '@/modules/hamdast/appFrame';

const Page = () => {
  const { handleOpen, handleClose, modalProps } = useModal();
  const [app, setApp] = useState<string>('');

  useEffect(() => {
    window?.clarity?.('upgrade', 'LauncherMain');
  }, []);

  return (
    <>
      <Seo title="خدمات" noIndex />
      <Modal {...modalProps} noHeader noLine bodyClassName="p-0" className="h-[90%]">
        <AppFrame appKey={app} params={['launcher']} dontShowProfile />
      </Modal>

      <GlobalContextsProvider>
        <LauncherMain
          onAction={action => {
            if (action.action === 'OPEN_APP') {
              setApp(action.appKey);
              handleOpen();
            }
          }}
        />
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
