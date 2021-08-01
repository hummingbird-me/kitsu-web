import '../src/styles/index.css';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  themes: {
    clearable: false,
    default: 'light',
    list: [
      { name: 'light', class: 'theme-light', color: '#f7f7f7' },
      { name: 'dark', class: 'theme-dark', color: '#443443' },
      { name: 'oled', class: 'theme-oled', color: '#000000' },
    ],
  },
};
