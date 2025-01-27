import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';

import Header from './Header';

type Story = StoryObj<typeof Header>;

export default {
  title: 'Components/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/7KLXsWEmbIbkNy9CnFA0Ke/Kitsu-Web-V4?node-id=37%3A164',
    },
  },
} satisfies Meta<typeof Header>;

export const Unauthenticated = {
  render: (args) => <Header {...args} />,
  args: {
    background: 'opaque',
  },
} satisfies Story;
