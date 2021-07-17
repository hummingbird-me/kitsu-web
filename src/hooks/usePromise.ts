import { useState, useEffect, DependencyList } from 'react';

export type PromiseState<T> = {
  state: 'pending' | 'rejected' | 'fulfilled';
  value?: T;
  error?: any;
};

export default function usePromise<T>(
  func: () => Promise<T>,
  deps: DependencyList
): PromiseState<T> {
  const [state, setState] = useState<PromiseState<T>>({
    state: 'pending',
  });

  useEffect(() => {
    let mounted = true;

    func().then(
      (value) => {
        if (mounted) setState({ state: 'fulfilled', value: value });
      },
      (error) => {
        if (mounted) setState({ state: 'rejected', error: error });
      }
    );
    return () => {
      mounted = false;
    };
  }, deps);

  return state;
}
