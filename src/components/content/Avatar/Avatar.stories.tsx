import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { imageSourceLoader } from 'app/docs/utilities/uploadToImageSource';

import Avatar from './index';

export default {
  title: 'Content/Avatar',
  component: Avatar,
  parameters: {
    status: {
      type: 'completed',
    },
    layout: 'centered',
    controls: { expanded: true },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/QnRsGDTY1hcHmeFX0seHqd/Kitsu-Design-(Universal)?node-id=41%3A7&t=DD4vSmziTuwYcwKT-1',
    },
  },
  argTypes: {
    source: {
      control: { type: 'file' },
    },
  },
} satisfies Meta<typeof Avatar>;

export const Default = {
  name: 'Default',
  loaders: [imageSourceLoader('source')],
  args: {
    size: 200,
  },
  render: (args, { loaded }) => <Avatar {...args} {...loaded} />,
} satisfies StoryObj<typeof Avatar>;
