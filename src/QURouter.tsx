import React from 'react';
import { Route, Routes } from 'react-router-dom';

import ForgotPasswordModal from './pages/Auth/ForgotPassword';
import AuthModal from './pages/Auth/Modal';
// import 'app/styles/index.css';

// import NotFoundPage from './pages/Errors/NotFound';
import SignInModal from './pages/Auth/SignIn';
import SignUpModal from './pages/Auth/SignUp';
import HomePage from './pages/QUEmbed/Home';
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
          path="/"
          element={
            <UserRoute>
              <HomePage />
            </UserRoute>
          }
        />
        {/*
              1. User signs in to kitsu via extension
              2. User goes to mangadex
              3. User goes to https://mangadex.org/title/9957316c-eadb-49c5-bc2d-f6cbfe9034a3/cheat-eater-isekai-shoukan-kotogotoku-horobubeshi
                a. We will also support a user going to direct chapters to start this flow (but not relevant for this example)
              4. We pass up all the params (for this example assume there is no Mapping or IndexDB record)
              5. We use the title name as the search (via Algolia)
              6. We return a list of titles to the user who will choose the one that is correct
                a. At this point it would also make a Mapping record draft (not in initial version)
              7. The user chooses one of the titles at which point it will add to their Library + use the library_entry_id to store some information in IndexDB

              Now whenever the user goes to this manga or reads from a chapter we can determine what library_entry needs to be updated via IndexDB.
          */}
        {/* <HomePage /> */}
        {/* <Route path="/*" component={NotFoundPage} /> */}
      </Routes>
    </>
  );
}
