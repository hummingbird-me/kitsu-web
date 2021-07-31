import React, { lazy } from 'react';
import { Location } from 'history';
import { Switch, Route, useLocation } from 'react-router-dom';

import 'app/styles/index.css';
import Header from 'app/components/Header';

import SignInModal from './pages/modals/SignIn';
import SignUpModal from './pages/modals/SignUp';
import ForgotPasswordModal from './pages/modals/ForgotPassword';

export default function Router() {
  // If the location has a background page set, we render the modal over it
  // Otherwise, we render the modal as the page itself
  const location = useLocation<Location & { background: Location }>();
  const background = location.state?.background;

  return (
    <>
      <Header background="opaque" />
      <Switch location={background || location}>
        <Route path="/users/:id">User Profile</Route>
        <Route path="/auth/sign-in">
          <SignInModal displayMode="page" />
        </Route>
        <Route path="/auth/sign-up">
          <SignUpModal displayMode="page" />
        </Route>
        <Route path="/auth/forgot-password">
          <ForgotPasswordModal displayMode="page" />
        </Route>
      </Switch>
      {background && (
        <>
          <Route path="/auth/sign-in">
            <SignInModal displayMode="modal" />
          </Route>
          <Route path="/auth/sign-up">
            <SignUpModal displayMode="modal" />
          </Route>
          <Route path="/auth/forgot-password">
            <ForgotPasswordModal displayMode="modal" />
          </Route>
        </>
      )}
    </>
  );
}
