import { useAsyncFn } from 'react-use';
import { AsyncState } from 'react-use/lib/useAsyncFn';

import { useSession } from 'app/contexts/SessionContext';
import useReturnToFn from 'app/hooks/useReturnToFn';
import { Session } from 'app/types/session';

export default function useLoginFn<params = unknown>(
  loginFn: (params: params) => Promise<Session>,
  params: params
): [AsyncState<void>, () => void] {
  const returnTo = useReturnToFn('/');
  const { setSession } = useSession();

  return useAsyncFn(async () => {
    setSession(await loginFn(params));
    returnTo();
  }, [params]);
}
