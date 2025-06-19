import { createContext, useContext, useState } from 'react';
import { UserInfo } from '../store/userInfo';
import { LoginModal } from '../views/loginModal';

interface State {
  state: boolean;
  title?: string;
  description?: string;
  closable?: boolean;
  onClose?: () => void;
  postLogin?: (userInfo: UserInfo) => void;
}

export type TodoContextType = {
  loginModalState: State;
  handleOpenLoginModal: (state: State) => void;
};

const LoginModalContext = createContext<TodoContextType | null>(null);

const useLoginModalContext = () => {
  const context = useContext(LoginModalContext);
  if (!context) {
    throw new Error(`useLoginModalContext must be used within a LoginModalContext`);
  }

  return context;
};

const LoginModalProvider = ({ children }: any) => {
  const [loginModalState, setLoginModalState] = useState<State>({
    state: false,
    title: undefined,
    description: undefined,
    closable: true,
    onClose: () => {
      return;
    },
  });

  const handleOpenLoginModal = (state: State) => {
    setLoginModalState({ ...state, closable: state.closable ?? true });
  };

  return (
    <LoginModalContext.Provider value={{ loginModalState, handleOpenLoginModal }}>
      {children}
      <LoginModal />
    </LoginModalContext.Provider>
  );
};

export { useLoginModalContext, LoginModalProvider };
