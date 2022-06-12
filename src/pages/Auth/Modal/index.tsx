import React, { useState, useContext } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';

import Modal from 'app/components/Modal';
import AuthModalHeader from 'app/components/AuthModalHeader';

import styles from './styles.module.css';

const AuthModalContext = React.createContext<{
  email?: string;
  setEmail: (email: string) => void;
}>({
  setEmail: () => null,
});

export function useAuthModalContext() {
  return useContext(AuthModalContext);
}

const AuthModal: React.FC<React.ComponentProps<typeof Modal>> = function ({
  displayMode,
}) {
  const { state } = useLocation() as {
    state: { email?: string } | undefined;
  };
  const [email, setEmail] = useState(state?.email ?? '');
  const outlet = useOutlet();

  return (
    <AuthModalContext.Provider value={{ email, setEmail }}>
      <Modal className={styles.modal} displayMode={displayMode}>
        <AuthModalHeader email={email} />
        {outlet}
      </Modal>
    </AuthModalContext.Provider>
  );
};

export default AuthModal;
