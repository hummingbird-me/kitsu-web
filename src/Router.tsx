import { ErrorBoundary } from '@sentry/react';
import React from 'react';
import { Location, Outlet, Route, Routes, useLocation } from 'react-router-dom';

import 'app/styles/index.css';

import GeneralErrorPage from './pages/Errors/General';
import NotFoundPage from './pages/Errors/NotFound';
import { modals, pages } from './pages/routes';

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
        {pages}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {/* The modal fades in and slides up */}
      {background && (
        <Routes>
          {modals}
          {/* Ignore any non-modal stuff */}
          <Route path="*" element={<Outlet />} />
        </Routes>
      )}
    </ErrorBoundary>
  );
}
