import { useAsyncFn } from 'react-use';
import { AsyncState } from 'react-use/lib/useAsyncFn';

import { useSession } from 'app/contexts/SessionContext';
import { Session } from 'app/types/session';
import useReturnToFn from 'app/hooks/useReturnToFn';

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
