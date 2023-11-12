import type { StorybookConfig } from '@storybook/types';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.tsx'],
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
    '@etchteam/storybook-addon-status',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    docsMode: true,
    autodocs: true,
  },
};
export default config;
