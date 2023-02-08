import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import NotFoundPage from './index';

export default {
  title: 'Pages/Errors/Not Found',
  component: NotFoundPage,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof NotFoundPage>;

export const NotFound: ComponentStory<typeof NotFoundPage> = () => (
  <NotFoundPage />
);
