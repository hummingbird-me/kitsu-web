import React from 'react';
import { Route } from 'react-router-dom';

import { Path, PathBuilder } from 'app/utils/routes';

import ForgotPasswordModal from './ForgotPassword';
import AuthLayout from './Layout';
import SignInModal from './SignIn';
import SignUpModal from './SignUp';

function authRoutes({ displayMode }: { displayMode: 'page' | 'modal' }) {
  return (
    <Route path="auth" element={<AuthLayout displayMode={displayMode} />}>
      <Route path="sign-in" element={<SignInModal />} />
      <Route path="sign-up" element={<SignUpModal />} />
      <Route path="forgot-password" element={<ForgotPasswordModal />} />
    </Route>
  );
}

export const modals = authRoutes({ displayMode: 'modal' });
export const pages = authRoutes({ displayMode: 'page' });
export const paths = {
  signIn: new Path('/sign-in'),
  signUp: new Path('/sign-up'),
} satisfies PathBuilder;
