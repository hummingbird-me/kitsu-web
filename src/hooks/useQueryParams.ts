import { useLocation } from 'react-router-dom';

export default function useQueryParams(): URLSearchParams {
  return new URLSearchParams(useLocation().search);
}
