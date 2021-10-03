import { create } from '@storybook/theming';

export default create({
  base: 'dark',

  colorPrimary: '#d95e40',
  colorSecondary: '#d95e40',

  // UI
  appBg: '#332532',
  appContentBg: '#402f3f',
  appBorderColor: '#796e79',
  appBorderRadius: 5,

  // Typography
  fontBase: '"Open Sans", sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: '#f7f7f7',
  textInverseColor: 'green',

  // Toolbar default and active colors
  barTextColor: '#a99fa8',
  barSelectedColor: '#d95e40',
  barBg: '#443443',

  // Form colors
  inputBg: 'white',
  inputBorder: 'silver',
  inputTextColor: 'black',
  inputBorderRadius: 4,

  brandTitle: 'Kitsu UI',
  brandUrl: 'https://components.kitsu.io',
  brandImage: 'https://kitsu.io/svg/kitsu-ui-logo.svg',
});
