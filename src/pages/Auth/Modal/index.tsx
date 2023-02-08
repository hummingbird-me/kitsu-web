import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useOutlet } from 'react-router-dom';

import AuthModalHeader from 'app/components/AuthModalHeader';
import Modal from 'app/components/Modal';

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
