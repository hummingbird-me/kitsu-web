import { useLocation } from 'react-router-dom';

export default function useQueryParams() {
  return new URLSearchParams(useLocation().search);
}
