// This file is imported directly in index.html to eliminate flash of unstyled content
// Do NOT add an export statement to this, or it will break
const themeKey = 'theme';

const getPreferredTheme = (): string => {
  const storedTheme = localStorage.getItem(themeKey);

  return storedTheme ??
    window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

const setTheme = () => {
  const body = document.querySelector(':root');
  body?.setAttribute(`data-${themeKey}`, getPreferredTheme());
};

setTheme();
