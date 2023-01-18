import Modal from '@/common/components/atom/modal';
import dynamic from 'next/dynamic';
import { useLoginModalContext } from '../context/loginModal';
const LoginForm = dynamic(() => import('./loginForm'));

export const LoginModal = () => {
  const { loginModalState, handleOpenLoginModal } = useLoginModalContext();

  return (
    <Modal
      isOpen={loginModalState.state}
      onClose={() =>
        loginModalState.closable &&
        handleOpenLoginModal({
          state: false,
        })
      }
      noHeader
    >
      <LoginForm
        title={loginModalState.title}
        description={loginModalState.description}
        postLogin={() => {
          handleOpenLoginModal({ state: false });
          loginModalState.postLogin && loginModalState.postLogin();
        }}
      />
    </Modal>
  );
};
