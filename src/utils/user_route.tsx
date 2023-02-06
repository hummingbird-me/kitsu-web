import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { useSession } from 'app/contexts/SessionContext';

export function UserRoute({ ...routeProps }: RouteProps) {
  const { session } = useSession();

  if (session?.loggedIn) {
    return <Route {...routeProps} />;
  } else {
    return <Redirect to="/auth/sign-in" />;
  }
}
