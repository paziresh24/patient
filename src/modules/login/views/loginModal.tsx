import Modal from '@/common/components/atom/modal';
import useModal from '@/common/hooks/useModal';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useLoginModalContext } from '../context/loginModal';
const LoginForm = dynamic(() => import('./loginForm'));

export const LoginModal = () => {
  const { loginModalState, handleOpenLoginModal } = useLoginModalContext();
  const { handleOpen, handleClose, modalProps } = useModal();

  useEffect(() => {
    if (loginModalState.state) handleOpen();
    if (!loginModalState.state) handleClose();
  }, [loginModalState]);

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
