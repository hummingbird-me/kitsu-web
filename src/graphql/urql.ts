import { type AnyVariables } from '@urql/core';
import { useMemo } from 'react';
import {
  useQuery as urql_useQuery,
  type UseQueryArgs,
  type UseQueryResponse,
} from 'urql';

export function useQuery<
  Data = unknown,
  Variables extends AnyVariables = AnyVariables,
>({
  suspense = true,
  context: baseContext,
  ...args
}: UseQueryArgs<Variables, Data> & { suspense?: boolean }): UseQueryResponse<
  Data,
  Variables
> {
  const context = useMemo(
    () => ({ suspense, ...baseContext }),
    [suspense, baseContext],
  );
  return urql_useQuery({ ...args, context } as UseQueryArgs<Variables, Data>);
}
