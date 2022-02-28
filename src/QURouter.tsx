import React from 'react';
import { Switch, Route } from 'react-router-dom';

// import 'app/styles/index.css';

// import NotFoundPage from './pages/Errors/NotFound';
import SignInModal from './pages/modals/SignIn';
import SignUpModal from './pages/modals/SignUp';
import ForgotPasswordModal from './pages/modals/ForgotPassword';

export default function QURouter() {
  return (
    <>
      <Switch>
        {/* <Route path="/users/:id">User Profile</Route> */}
        <Route path="/auth/sign-in">
          <SignInModal displayMode="page" />
        </Route>
        <Route path="/auth/sign-up">
          <SignUpModal displayMode="page" />
        </Route>
        <Route path="/auth/forgot-password">
          <ForgotPasswordModal displayMode="page" />
        </Route>
        {/* <Route path="/*" component={NotFoundPage} /> */}
      </Switch>
    </>
  );
}
