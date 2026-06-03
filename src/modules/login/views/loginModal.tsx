import Modal from '@/common/components/atom/modal';
import useModal from '@/common/hooks/useModal';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useLoginModalContext } from '../context/loginModal';
const LoginForm = dynamic(() => import('./loginForm'));
import { useRouter } from 'next/router';


export const LoginModal = () => {
  const { loginModalState, handleOpenLoginModal } = useLoginModalContext();
  const { handleOpen, handleClose, modalProps } = useModal();
  const { pathname } = useRouter()

  useEffect(() => {
    if (loginModalState.state) handleOpen();
    if (!loginModalState.state) handleClose();
  }, [loginModalState]);

  useEffect(() => {
    handleClose()
  }, [pathname])

  return (
    <Modal
      {...modalProps}
      onClose={() => {
        if (loginModalState.closable) {
          handleOpenLoginModal({
            ...loginModalState,
            state: false,
          });
          handleClose();
          loginModalState?.onClose?.();
        }
      }}
      noHeader
    >
      <LoginForm
        title={loginModalState.title}
        description={loginModalState.description}
        postLogin={userInfo => {
          handleOpenLoginModal({ state: false });
          loginModalState.postLogin && loginModalState.postLogin(userInfo);
        }}
      />
    </Modal>
  );
};
