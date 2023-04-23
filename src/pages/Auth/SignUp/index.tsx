import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  FaApple as AppleLogo,
  FaFacebook as FacebookLogo,
  FaTwitter as TwitterLogo,
} from 'react-icons/fa';
import * as yup from 'yup';

import Rule from 'app/components/Rule';
import Button, {
  ButtonColor,
  ButtonKind,
  ButtonPreset,
} from 'app/components/controls/Button';
import TextInput from 'app/components/controls/TextInput';

import { useAuthModalContext } from '../Layout';
import styles from './styles.module.css';

const schema = yup
  .object({
    username: yup.string().min(3).max(20).required(),
    email: yup.string().email().min(3).required(),
    password: yup.string().max(72).required(),
    confirmPassword: yup
      .string()
      .test(
        'passwords-match',
        'Passwords must match',
        (value, ctx) => ctx.parent.password === value
      ),
  })
  .required();

export default function SignUpModal(): JSX.Element {
  const { email: defaultEmail, setEmail } = useAuthModalContext();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    shouldUseNativeValidation: true,
    mode: 'onTouched',
    criteriaMode: 'all',
    resolver: yupResolver(schema),
    defaultValues: {
      username: '',
      email: defaultEmail,
      password: '',
      confirmPassword: '',
    },
  });
  const currentEmail = watch('email');
  useEffect(() => {
    currentEmail && setEmail(currentEmail);
  }, [currentEmail]);

  return (
    <form
      noValidate
      className={styles.authForm}
      onSubmit={handleSubmit((args) => console.log(args))}>
      <TextInput
        autoFocus
        type="text"
        autoComplete="username"
        label="Username"
        onInvalid={(e) => e.preventDefault()}
        validation={
          errors.username && {
            type: 'invalid',
            message: errors.username.message,
          }
        }
        {...register('username')}
      />
      <TextInput
        type="email"
        autoComplete="email"
        label="Email"
        onInvalid={(e) => e.preventDefault()}
        validation={
          errors.email && {
            type: 'invalid',
            message: errors.email.message,
          }
        }
        {...register('email')}
      />
      <TextInput
        type="password"
        autoComplete="new-password"
        label="Password"
        onInvalid={(e) => e.preventDefault()}
        validation={
          errors.password && {
            type: 'invalid',
            message: errors.password.message,
          }
        }
        {...register('password')}
      />
      <TextInput
        type="password"
        autoComplete="new-password"
        label="Confirm Password"
        onInvalid={(e) => e.preventDefault()}
        validation={
          errors.confirmPassword && {
            type: 'invalid',
            message: errors.confirmPassword.message,
          }
        }
        {...register('confirmPassword')}
      />
      <Button type="submit" {...ButtonPreset.PRIMARY}>
        Create account
      </Button>
      <Rule label="Or sign up with" />
      <div className={styles.socialLoginContainer}>
        <Button
          kind={ButtonKind.OUTLINE}
          color={ButtonColor.GREY}
          className={styles.socialLoginButton}>
          <FacebookLogo title="Log in with Facebook" />
        </Button>
        <Button
          kind={ButtonKind.OUTLINE}
          color={ButtonColor.GREY}
          className={styles.socialLoginButton}>
          <TwitterLogo title="Log in with Twitter" />
        </Button>
        <Button
          kind={ButtonKind.OUTLINE}
          color={ButtonColor.GREY}
          className={styles.socialLoginButton}>
          <AppleLogo title="Log in with Apple" />
        </Button>
      </div>
    </form>
  );
}
