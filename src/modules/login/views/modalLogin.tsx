import Modal from '@/common/components/atom/modal';
import { useLoginModalContext } from '../context/loginModal';
import LoginForm from './loginForm';

export const ModalLogin = () => {
  const { loginModalState, openLoginModal } = useLoginModalContext();

  return (
    <Modal
      isOpen={loginModalState.state}
      onClose={() =>
        openLoginModal({
          state: false,
        })
      }
      noHeader
    >
      <div className="pt-5">
        <LoginForm
          title={loginModalState.title}
          postLogin={() => {
            openLoginModal(prev => ({ ...prev, state: false }));
            loginModalState.postLogin && loginModalState.postLogin();
          }}
        />
      </div>
    </Modal>
  );
};
