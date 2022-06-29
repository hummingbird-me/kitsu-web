import React from 'react';
import { Location } from 'history';
import { Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { ErrorBoundary } from '@sentry/react';

import 'app/styles/index.css';

// import AnimePage, { AnimeById } from './pages/Anime';
import NotFoundPage from './pages/Errors/NotFound';
import AuthModal from './pages/Auth/Modal';
import SignInModal from './pages/Auth/SignIn';
import SignUpModal from './pages/Auth/SignUp';
import ForgotPasswordModal from './pages/Auth/ForgotPassword';
import GeneralErrorPage from './pages/Errors/General';

function modals({ displayMode }: { displayMode: 'page' | 'modal' }) {
  return (
    <Route path="auth" element={<AuthModal displayMode={displayMode} />}>
      <Route path="sign-in" element={<SignInModal />} />
      <Route path="sign-up" element={<SignUpModal />} />
      <Route path="forgot-password" element={<ForgotPasswordModal />} />
    </Route>
  );
}

export default function Router() {
  // If the location has a background page set, we render the modal over it
  // Otherwise, we render the modal as the page itself
  const location = useLocation() as Location & {
    state: { background: Location };
  };
  const background = location.state?.background;

  return (
    <ErrorBoundary fallback={<GeneralErrorPage />}>
      <Routes location={background || location}>
        <Route path="anime">
          {/* <Route path=":id(\d+)" element={<AnimeById />} />
          <Route path=":slug" element={<AnimePage />} /> */}
        </Route>
        {modals({ displayMode: 'page' })}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {/* The modal fades in and slides up */}
      {background && (
        <Routes>
          {modals({ displayMode: 'modal' })}
          {/* Ignore any non-modal stuff */}
          <Route path="*" element={<Outlet />} />
        </Routes>
      )}
    </ErrorBoundary>
  );
}
