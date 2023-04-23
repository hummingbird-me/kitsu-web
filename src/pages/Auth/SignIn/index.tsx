import getAuthorization from '@nanoauth/myanimelist';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  FaApple as AppleLogo,
  FaFacebook as FacebookLogo,
  FaTwitter as TwitterLogo,
} from 'react-icons/fa';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';

import ModalLink from 'app/components/ModalLink';
import Rule from 'app/components/Rule';
import Button, {
  ButtonColor,
  ButtonKind,
  ButtonPreset,
} from 'app/components/controls/Button';
import TextInput from 'app/components/controls/TextInput';
import Alert from 'app/components/feedback/Alert';
import { nanoauthCredentials } from 'app/constants/config';
import { useSession } from 'app/contexts/SessionContext';
import { LoginFailed } from 'app/errors';
import useReturnToFn from 'app/hooks/useReturnToFn';
import loginWithPassword from 'app/utils/login/withPassword';

import { useAuthModalContext } from '../Layout';
import styles from './styles.module.css';

function useFormatErrorMessage(formatMessage: IntlShape['formatMessage']) {
  return function formatErrorMessage(error?: Error): string {
    if (error instanceof LoginFailed) {
      return formatMessage({
        defaultMessage: 'Email or password is incorrect',
        description: 'Error message when a sign in fails ',
      });
    } else {
      return formatMessage({
        defaultMessage: 'An unexpected error occurred, please try again later',
        description: 'Generic error message when a sign in fails',
      });
    }
  };
}

const SignInModal: React.FC = function (): JSX.Element {
  const { email: defaultEmail, setEmail } = useAuthModalContext();
  const { formatMessage } = useIntl();
  const { setSession } = useSession();
  const returnTo = useReturnToFn();
  const formatErrorMessage = useFormatErrorMessage(formatMessage);
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: defaultEmail,
      password: '',
    },
  });
  const email = watch('email');
  useEffect(() => {
    email && setEmail(email);
  }, [email]);

  return (
    <form
      noValidate
      className={styles.authForm}
      onSubmit={handleSubmit(async ({ email, password }) => {
        try {
          const result = await loginWithPassword({
            username: email,
            password,
          });
          setSession(result);
          returnTo();
          console.log(result);
        } catch (e) {
          setError('root', {
            type: 'serverError',
            message: formatErrorMessage(e as Error),
          });
        }
      })}>
      {errors.root ? <Alert kind="error">{errors.root?.message}</Alert> : null}
      <TextInput
        autoFocus
        type="email"
        autoComplete="email"
        label={formatMessage({
          defaultMessage: 'Email',
          description: 'Placeholder for email input on Sign In',
        })}
        {...register('email')}
      />
      <TextInput
        type="password"
        autoComplete="current-password"
        label={formatMessage({
          defaultMessage: 'Password',
          description: 'Placeholder for current password input on Sign In',
        })}
        {...register('password')}
      />
      <Button type="submit" {...ButtonPreset.PRIMARY} loading={isSubmitting}>
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
          color={ButtonColor.GREY}
          className={styles.socialLoginButton}
          onClick={async () => {
            const result = await getAuthorization({
              clientId: nanoauthCredentials.myanimelist.clientId,
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
          color={ButtonColor.GREY}
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
          color={ButtonColor.GREY}
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
