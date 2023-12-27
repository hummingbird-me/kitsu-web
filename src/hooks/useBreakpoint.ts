import { useMediaQuery } from '@react-hookz/web/esm';

import breakpoints from 'app/styles/globals/breakpoints.json';

export const useBreakpoint = (
  breakpoint: keyof typeof breakpoints
) => {
  return useMediaQuery(breakpoints[breakpoint]);
};
