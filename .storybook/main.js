module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.tsx'],
  addons: [
    'storybook-addon-themes',
    '@storybook/addon-links',
    {
      name: '@storybook/addon-essentials',
      options: { backgrounds: false },
    },
    'storybook-addon-designs',
    '@storybook/addon-a11y',
    '@storybook/addon-postcss',
    'storybook-css-modules-preset',
  ],
};
