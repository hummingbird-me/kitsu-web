import React from 'react';
import {
  FaFacebook as FacebookLogo,
  FaApple as AppleLogo,
  FaTwitter as TwitterLogo,
} from 'react-icons/fa';

import Modal from 'app/components/Modal';
import Button, { ButtonKind } from 'app/components/Button';
import TextInput from 'app/components/TextInput';
import Rule from 'app/components/Rule';
import AuthModalHeader from 'app/components/AuthModalHeader';

import styles from './styles.module.css';

export default function SignInModal({
  displayMode,
}: {
  displayMode: 'page' | 'modal';
}) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  return (
    <Modal displayMode={displayMode} className={styles.modal}>
      <AuthModalHeader />
      <form className={styles.authForm}>
        <TextInput
          type="email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextInput
          type="password"
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" kind={ButtonKind.PRIMARY}>
          Log in
        </Button>
        <Rule label="Or log in with" />
        <div className={styles.socialLoginContainer}>
          <Button
            kind={ButtonKind.OUTLINE}
            className={styles.socialLoginButton}>
            <FacebookLogo title="Log in with Facebook" />
          </Button>
          <Button
            kind={ButtonKind.OUTLINE}
            className={styles.socialLoginButton}>
            <TwitterLogo title="Log in with Twitter" />
          </Button>
          <Button
            kind={ButtonKind.OUTLINE}
            className={styles.socialLoginButton}>
            <AppleLogo title="Log in with Apple" />
          </Button>
        </div>
      </form>
    </Modal>
  );
}
