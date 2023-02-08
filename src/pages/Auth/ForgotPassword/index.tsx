import React from 'react';
import { useLocation } from 'react-router-dom';

import AuthModalHeader from 'app/components/AuthModalHeader';
import Button, { ButtonKind } from 'app/components/Button';
import Modal from 'app/components/Modal';
import TextInput from 'app/components/controls/TextInput';

import { useAuthModalContext } from '../Modal';
import styles from './styles.module.css';

export default function ForgotPasswordModal(): JSX.Element {
  const { email, setEmail } = useAuthModalContext();

  return (
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
  );
}
