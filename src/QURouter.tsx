import React from 'react';
import { Route, Routes } from 'react-router-dom';

import ForgotPasswordModal from './pages/Auth/ForgotPassword';
import AuthModal from './pages/Auth/Modal';
// import 'app/styles/index.css';

// import NotFoundPage from './pages/Errors/NotFound';
import SignInModal from './pages/Auth/SignIn';
import SignUpModal from './pages/Auth/SignUp';
import HomePage from './pages/QUEmbed/Home';
import MediaPage from './pages/QUEmbed/MediaPage';
import SearchPage from './pages/QUEmbed/SearchPage';
import { UserRoute } from './utils/user_route';

export default function QURouter() {
  return (
    <>
      <Routes>
        <Route path="auth" element={<AuthModal displayMode="page" />}>
          <Route path="sign-in" element={<SignInModal />} />
          <Route path="sign-up" element={<SignUpModal />} />
          <Route path="forgot-password" element={<ForgotPasswordModal />} />
        </Route>
        {/* NOTE: is there a way to declare which query params are allowed? */}
        <Route
          path="/search"
          element={
            <UserRoute>
              <SearchPage />
            </UserRoute>
          }
        />
        <Route
          path="/"
          element={
            <UserRoute>
              <MediaPage />
            </UserRoute>
          }
        />
      </Routes>
    </>
  );
}
