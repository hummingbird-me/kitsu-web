import React, { ReactElement } from 'react';
import { useSession } from 'app/contexts/SessionContext';

export default function Home(): ReactElement {
  const { session } = useSession();

  // return session?.loggedIn ? <Media /> : <LoginForm />;
}
