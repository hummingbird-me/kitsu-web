import React from 'react';
import {
  FaFacebook as FacebookLogo,
  FaApple as AppleLogo,
  FaTwitter as TwitterLogo,
} from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { useIntl, FormattedMessage } from 'react-intl';

import ModalLink from 'app/components/ModalLink';
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
}): JSX.Element {
  const { formatMessage } = useIntl();
  const { state } =
    useLocation<{ email?: string; password?: string } | undefined>();
  const [email, setEmail] = React.useState(state?.email ?? '');
  const [password, setPassword] = React.useState(state?.password ?? '');

  return (
    <Modal displayMode={displayMode} className={styles.modal}>
      <AuthModalHeader email={email} />
      <form className={styles.authForm}>
        <TextInput
          type="email"
          autoComplete="email"
          placeholder={formatMessage({
            defaultMessage: 'Email',
            description: 'Placeholder for email input on Sign In',
          })}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextInput
          type="password"
          autoComplete="current-password"
          placeholder={formatMessage({
            defaultMessage: 'Password',
            description: 'Placeholder for current password input on Sign In',
          })}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          kind={ButtonKind.PRIMARY}
          loading={passwordLoginState.loading}>
          <FormattedMessage
            defaultMessage="Log in"
            description="Submit button for Sign In"
          />
        </Button>
        <Rule
          label={formatMessage({
            defaultMessage: 'Or log in with',
            description: 'Separator text above social media Sign In buttons',
          })}
        />
        <div className={styles.socialLoginContainer}>
          <Button
            type="button"
            kind={ButtonKind.OUTLINE}
            className={styles.socialLoginButton}>
            <FacebookLogo
              title={formatMessage({
                defaultMessage: 'Log in with Facebook',
                description: 'Hover text for Facebook sign in button',
              })}
            />
          </Button>
          <Button
            type="button"
            kind={ButtonKind.OUTLINE}
            className={styles.socialLoginButton}>
            <TwitterLogo
              title={formatMessage({
                defaultMessage: 'Log in with Twitter',
                description: 'Hover text for Twitter sign in button',
              })}
            />
          </Button>
          <Button
            type="button"
            kind={ButtonKind.OUTLINE}
            className={styles.socialLoginButton}>
            <AppleLogo
              title={formatMessage({
                defaultMessage: 'Log in with Apple',
                description: 'Hover text for Apple sign in button',
              })}
            />
          </Button>
        </div>
        <div className={styles.subformLink}>
          <ModalLink to="/auth/forgot-password">
            <FormattedMessage
              defaultMessage="Forgot Password?"
              description="Link to password reset page from sign in form"
            />
          </ModalLink>
        </div>
      </form>
    </Modal>
  );
}
