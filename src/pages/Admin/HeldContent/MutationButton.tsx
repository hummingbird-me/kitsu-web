import { captureException } from '@sentry/react';
import { type DocumentNode } from 'graphql';
import React, { useCallback, useState } from 'react';
import { BsXCircleFill } from 'react-icons/bs';
import { type AnyVariables, type OperationResult } from 'urql';

import Button, { type ButtonProps } from '@/components/controls/Button';
import { useMutation, type ResultOf } from '@/graphql';

export default function MutationButton<
  Mutation extends DocumentNode,
  Variables extends AnyVariables,
>({
  mutation,
  variables,
  didError,
  onMutate,
  children,
  ...props
}: {
  mutation: Mutation;
  variables: Variables;
  didError?(
    result: OperationResult<ResultOf<Mutation>, Variables>,
  ): string | null | undefined;
  onMutate?(result: OperationResult<ResultOf<Mutation>, Variables>): void;
} & ButtonProps) {
  const [result, mutate] = useMutation<ResultOf<Mutation>, Variables>(mutation);
  const [error, setError] = useState<string | null | undefined>(null);

  const onClick = useCallback(async () => {
    const result = await mutate(variables);
    setError(didError ? didError(result) : null);
    if (result.error) captureException(result.error);

    if (onMutate) onMutate(result);
  }, [mutate, variables, didError, onMutate]);

  return (
    <Button
      onClick={onClick}
      loading={result.fetching}
      disabled={result.fetching}
      {...props}>
      {error ? (
        <>
          <BsXCircleFill aria-hidden />
          {error}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
