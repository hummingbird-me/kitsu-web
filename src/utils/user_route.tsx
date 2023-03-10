import React from 'react';
import { Navigate, RouteProps } from 'react-router-dom';

import { useSession } from 'app/contexts/SessionContext';

export function UserRoute({ children }: RouteProps) {
  const { session } = useSession();

  if (session?.loggedIn) {
    return children;
  } else {
    return <Navigate to="/auth/sign-in" />;
  }
}
