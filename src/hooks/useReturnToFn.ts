import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import useQueryParams from 'app/hooks/useQueryParams';

export default function useReturnToFn(defaultLocation?: string): () => void {
  const location = useLocation<{ background?: Location }>();
  const history = useHistory();
  const params = useQueryParams();
  const returnTo = params.get('returnTo');

  return useCallback(() => {
    if (location.state?.background) {
      history.push(location.state?.background);
    } else if (returnTo) {
      history.push(returnTo);
    } else if (defaultLocation) {
      history.push(defaultLocation);
    }
  }, [returnTo, location.state?.background]);
}
