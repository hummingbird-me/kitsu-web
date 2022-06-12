import React, { useState } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';

import Modal from 'app/components/Modal';
import AuthModalHeader from 'app/components/AuthModalHeader';

import styles from './styles.module.css';

const AuthModal: React.FC<React.ComponentProps<typeof Modal>> = function ({
  displayMode,
}) {
  const { state } = useLocation() as {
    state: { email?: string } | undefined;
  };
  const [email, setEmail] = useState(state?.email ?? '');
  const outlet = useOutlet();

  return (
    <Modal className={styles.modal} displayMode={displayMode}>
      <AuthModalHeader email={email} />
      {outlet}
    </Modal>
  );
};

export default AuthModal;
