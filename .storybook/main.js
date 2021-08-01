module.exports = {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    'storybook-addon-themes',
    '@storybook/addon-links',
    {
      name: '@storybook/addon-essentials',
      options: { backgrounds: false },
    },
    '@storybook/addon-postcss',
    'storybook-css-modules-preset',
  ],
};
