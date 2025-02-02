import { captureException } from '@sentry/react';
import { type DocumentNode } from 'graphql';
import React, { useCallback, useState } from 'react';
import { BsCheckCircleFill, BsXCircleFill } from 'react-icons/bs';
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
  const [success, setSuccess] = useState(false);

  const onClick = useCallback(async () => {
    const result = await mutate(variables);
    const errorMessage = didError ? didError(result) : null;
    setError(errorMessage);
    if (!errorMessage) {
      setSuccess(true);
      if (onMutate) onMutate(result);
    }
    if (result.error) captureException(result.error);
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
      ) : success ? (
        <>
          <BsCheckCircleFill aria-hidden />
          Done!
        </>
      ) : (
        children
      )}
    </Button>
  );
}
