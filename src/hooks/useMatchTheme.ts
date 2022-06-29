import { useLayoutEffect, useState } from 'react';

export type themes = 'theme-light' | 'theme-dark' | 'theme-oled';
/**
 * Uses an observer to detect whenever data-theme has udpated.
 *
 * The consumer of this hook can bind additional logic depending on app's current theme.
 */
const useMatchTheme = (initalizedTheme: themes | null = null) => {
  //initialize theme manually or grab current theme.
  let [theme, setTheme] = useState<themes>(
    initalizedTheme
      ? initalizedTheme
      : (document.querySelector('html')?.dataset.theme as themes) ?? 'light'
  );

  //1.a Initailize mutationoverser onto either Storybook or Kitsu's site
  useLayoutEffect(() => {
    let observingElement: HTMLHtmlElement | HTMLBodyElement | null =
      document.querySelector('html');
    let attributeFilter = 'data-theme';

    /** ---- 1.b STORYBOOK ONLY conditionally assign for storybook's theme choices which locates on body instead---- */
    let targetBody = document.querySelector('body');
    if (targetBody?.classList.contains('sb-show-main')) {
      observingElement = targetBody;
      attributeFilter = 'class';
    }

    /** 2. set up mutation observer  */
    const observer = new MutationObserver(() => {
      if (attributeFilter == 'class') {
        setTheme((observingElement?.classList[2] as themes) ?? 'light');
      } else {
        setTheme((observingElement?.dataset.theme as themes) ?? 'light');
      }
    });
    observer.observe(observingElement!, {
      attributeFilter: [attributeFilter],
    });
    return () => {
      observer.disconnect();
    };
  }, []);

  return theme;
};

export default useMatchTheme;
