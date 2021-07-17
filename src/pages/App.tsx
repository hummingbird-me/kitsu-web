import React, { useState, useEffect } from 'react';
import { Location } from 'history';
import { Switch, Route, useLocation } from 'react-router-dom';

import 'app/styles/index.css';
import Header from 'app/components/Header';
import isBooted from 'app/initializers';

import SignInModal from './modals/SignIn';

export default function App() {
  const booted = isBooted();
  const location = useLocation<Location & { background: Location }>();
  const background = location.state?.background;

  return (
    booted && (
      <>
        <Header background="opaque" />
        <Switch location={background || location}>
          <Route path="/users/:id">User Profile</Route>
          <Route path="/auth/log-in">
            <SignInModal displayMode="page" />
          </Route>
        </Switch>
        {background && (
          <Route path="/auth/log-in">
            <SignInModal displayMode="modal" />
          </Route>
        )}
      </>
    )
  );
}
