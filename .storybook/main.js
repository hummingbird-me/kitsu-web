const path = require('path');
module.exports = {
  stories: [
    '../src/docs/**/*.mdx',
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.tsx',
  ],
  addons: [
    'storybook-addon-themes',
    '@storybook/addon-links',
    {
      name: '@storybook/addon-essentials',
      options: {
        backgrounds: false,
      },
    },
    'storybook-addon-designs',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};
