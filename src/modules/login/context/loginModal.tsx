import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';

interface State {
  state: boolean;
  title?: string;
  postLogin?: () => void;
}

export type TodoContextType = {
  loginModalState: State;
  openLoginModal: Dispatch<SetStateAction<State>>;
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
  const [loginModalState, openLoginModal] = useState<State>({
    state: false,
    title: '',
  });

  return <LoginModalContext.Provider value={{ loginModalState, openLoginModal }}>{children}</LoginModalContext.Provider>;
};

export { useLoginModalContext, LoginModalProvider };
