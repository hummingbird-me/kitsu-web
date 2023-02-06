import React from 'react';
import { Switch, Route } from 'react-router-dom';

// import 'app/styles/index.css';

// import NotFoundPage from './pages/Errors/NotFound';
import SignInModal from './pages/modals/SignIn';
import SignUpModal from './pages/modals/SignUp';
import ForgotPasswordModal from './pages/modals/ForgotPassword';
import { UserRoute } from './utils/user_route';
import QUEmbedHome from './pages/QUEmbedHome';

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
        <UserRoute path="/">
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
          <QUEmbedHome />
        </UserRoute>
        {/* <Route path="/*" component={NotFoundPage} /> */}
      </Switch>
    </>
  );
}
