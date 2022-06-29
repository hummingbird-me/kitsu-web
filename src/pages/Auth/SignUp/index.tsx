import React from 'react';
import {
  FaFacebook as FacebookLogo,
  FaApple as AppleLogo,
  FaTwitter as TwitterLogo,
} from 'react-icons/fa';

import Button, {
  AlternativeColors,
  ButtonKind,
  HoverBehaviour,
} from 'app/components/Button';
import TextInput from 'app/components/TextInput';
import Rule from 'app/components/Rule';

import styles from './styles.module.css';
import { useAuthModalContext } from '../Modal';

export default function SignUpModal(): JSX.Element {
  const { email, setEmail } = useAuthModalContext();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  return (
    <form className={styles.authForm}>
      <TextInput
        autoFocus
        type="text"
        autoComplete="username"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextInput
        type="email"
        autoComplete="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextInput
        type="password"
        autoComplete="new-password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <TextInput
        type="password"
        autoComplete="new-password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Button
        type="submit"
        kind={ButtonKind.PRIMARY}
        hoverBehaviour={HoverBehaviour.LIGHTEN}>
        Create account
      </Button>
      <Rule label="Or sign up with" />
      <div className={styles.socialLoginContainer}>
        <Button kind={ButtonKind.OUTLINE} className={styles.socialLoginButton}>
          <FacebookLogo title="Log in with Facebook" />
        </Button>
        <Button kind={ButtonKind.OUTLINE} className={styles.socialLoginButton}>
          <TwitterLogo title="Log in with Twitter" />
        </Button>
        <Button kind={ButtonKind.OUTLINE} className={styles.socialLoginButton}>
          <AppleLogo title="Log in with Apple" />
        </Button>
      </div>
    </form>
  );
}
