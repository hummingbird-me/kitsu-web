import React, { useState, useEffect } from 'react';
import { Location } from 'history';
import { Switch, Route, useLocation } from 'react-router-dom';

import 'app/styles/index.css';
import Header from 'app/components/Header';
import Modal from 'app/components/Modal';

export default function App() {
  const location = useLocation<Location & { background: Location }>();
  const background = location.state?.background;

  return (
    <>
      <Header background="opaque" />
      <Switch location={background || location}>
        <Route path="/users/:id">User Profile</Route>
        <Route path="/auth/sign-in">
          <Modal displayMode="page">Sign in</Modal>
        </Route>
      </Switch>
      {background && (
        <Route path="/auth/sign-in">
          <Modal displayMode="modal">Sign in</Modal>
        </Route>
      )}
    </>
  );
}
