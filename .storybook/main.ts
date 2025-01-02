import type { StorybookConfig } from '@storybook/types';

export default {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.tsx'],

  addons: [
    '@storybook/addon-links',
    {
      name: '@storybook/addon-essentials',
      options: {
        backgrounds: false,
      },
    },
    '@storybook/addon-designs',
    '@storybook/addon-a11y',
    '@etchteam/storybook-addon-status',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    docsMode: true,
  },
} satisfies StorybookConfig;
