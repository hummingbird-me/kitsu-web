import React from 'react';
import {
  FaFacebook as FacebookLogo,
  FaApple as AppleLogo,
  FaTwitter as TwitterLogo,
} from 'react-icons/fa';
import { useIntl, FormattedMessage } from 'react-intl';
import getAuthorization from '@nanoauth/myanimelist';

// import { malClientId } from 'app/constants/config';
import ModalLink from 'app/components/ModalLink';
import Button, { AlternativeColors, ButtonKind, HoverBehaviour } from 'app/components/Button';
import TextInput from 'app/components/TextInput';
import Rule from 'app/components/Rule';
import _loginWithPassword from 'app/utils/login/withPassword';
import useLoginFn from 'app/hooks/useLoginFn';
import { LoginFailed } from 'app/errors';
import Alert from 'app/components/Alert';

import styles from './styles.module.css';
import { useAuthModalContext } from '../Modal';

function errorMessageFor(error?: Error): JSX.Element | null {
  if (error instanceof LoginFailed) {
    return (
      <FormattedMessage
        defaultMessage="Email or password is incorrect"
        description="Error message when a sign in fails "
      />
    );
  } else if (!error) {
    return null;
  } else {
    return (
      <FormattedMessage
        defaultMessage="An unexpected error occurred, please try again later"
        description="Generic error message when a sign in fails"
      />
    );
  }
}

const SignInModal: React.FC = function (): JSX.Element {
  const { formatMessage } = useIntl();
  const { email, setEmail } = useAuthModalContext();
  const [password, setPassword] = React.useState('');
  const [passwordLoginState, loginWithPassword] = useLoginFn(
    _loginWithPassword,
    { username: email, password }
  );
  const passwordErrorMessage = errorMessageFor(passwordLoginState?.error);

  return (
    <form
      className={styles.authForm}
      onSubmit={(ev) => {
        ev.preventDefault();
        loginWithPassword();
      }}>
      {passwordLoginState.error ? (
        <Alert kind="error">{passwordErrorMessage}</Alert>
      ) : null}
      <TextInput
        autoFocus
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
        hoverBehaviour={HoverBehaviour.LIGHTEN}
        alternativeColor={AlternativeColors.GREEN}
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
          className={styles.socialLoginButton}
          onClick={async () => {
            const result = await getAuthorization({
              clientId: malClientId,
              redirectUri: 'http://localhost:3000/oauth2-callback.html',
            });
            console.log(result);
          }}>
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
  );
};

export default SignInModal;
