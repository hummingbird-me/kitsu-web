import React from 'react';
import { useLocation } from 'react-router-dom';

import Modal from 'app/components/Modal';
import Button, { ButtonKind } from 'app/components/Button';
import TextInput from 'app/components/TextInput';
import AuthModalHeader from 'app/components/AuthModalHeader';

import styles from './styles.module.css';

export default function ForgotPasswordModal({
  displayMode,
}: {
  displayMode: 'page' | 'modal';
}): JSX.Element {
  const { state } = useLocation<{ email?: string } | undefined>();
  const [email, setEmail] = React.useState(state?.email ?? '');

  return (
    <Modal displayMode={displayMode} className={styles.modal}>
      <AuthModalHeader email={email} />
      <form className={styles.authForm}>
        <TextInput
          type="email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" kind={ButtonKind.PRIMARY}>
          Send password reset
        </Button>
      </form>
    </Modal>
  );
}
