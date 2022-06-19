import { useMediaQuery } from '@react-hookz/web/esnext';

export default function useReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
