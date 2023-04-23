import React from 'react';
import { useLocation } from 'react-router-dom';

import AuthModalHeader from 'app/components/AuthModalHeader';
import Modal from 'app/components/Modal';
import Button, { ButtonPreset } from 'app/components/controls/Button';
import TextInput from 'app/components/controls/TextInput';

import { useAuthModalContext } from '../Layout';
import styles from './styles.module.css';

export default function ForgotPasswordModal(): JSX.Element {
  const { email, setEmail } = useAuthModalContext();

  return (
    <form className={styles.authForm}>
      <TextInput
        type="email"
        autoComplete="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button type="submit" {...ButtonPreset.PRIMARY}>
        Send password reset
      </Button>
    </form>
  );
}
