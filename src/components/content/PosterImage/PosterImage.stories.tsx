import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { source as defaultPoster } from 'app/assets/default_poster.jpg?imageSource';
import ImageStories from 'app/components/content/Image/Image.stories';
import { imageSourceLoader } from 'app/docs/utilities/uploadToImageSource';

import PosterImage from './index';

export default {
  title: 'Content/PosterImage',
  component: PosterImage,
  parameters: {
    status: {
      type: 'completed',
    },
    layout: 'centered',
  },
  argTypes: {
    ...ImageStories.argTypes,
    source: {
      control: { type: 'file' },
      table: {
        defaultValue: {
          summary: 'app/assets/default_poster.jpg',
          detail: JSON.stringify(defaultPoster, null, 2),
        },
      },
    },
  },
} satisfies Meta<typeof PosterImage>;

export const Default = {
  name: 'Default',
  loaders: [imageSourceLoader('background')],
  render: ({ width, ...args }, { loaded }) => (
    <PosterImage width={width ?? 200} {...args} {...loaded} />
  ),
} satisfies StoryObj<typeof PosterImage>;
