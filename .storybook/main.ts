import type { StorybookConfig } from '@storybook/types';

const config: StorybookConfig = {
  stories: [
    '../src/docs/**/*.mdx',
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.tsx',
  ],
  addons: [
    '@kitsu-io-forks/storybook-addon-themes',
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
  docs: {
    autodocs: true,
  },
};
export default config;
