import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { imageSourceLoader } from 'app/docs/utilities/uploadToImageSource';

import BannerImage from './index';

export default {
  title: 'Content/BannerImage',
  component: BannerImage,
  parameters: {
    status: {
      type: 'completed',
    },
    layout: 'fullscreen',
  },
  argTypes: {
    background: {
      control: { type: 'file' },
    },
    isLoaded: {
      control: { type: 'boolean' },
      defaultValue: true,
    },
  },
} satisfies Meta<typeof BannerImage>;

export const Default = {
  name: 'Default',
  loaders: [imageSourceLoader('background')],
  render: (args, { loaded }) => <BannerImage {...args} {...loaded} />,
} satisfies StoryObj<typeof BannerImage>;

/**
 * When you add children to a BannerImage, it renders them in an overlay flexbox, packs them to the
 * bottom of a column, darkens the image to improve visibility against it, and adds a top padding to
 * compensate for the height of the site navigation header.
 */
export const WithChildren = {
  name: 'With Children',
  loaders: [imageSourceLoader('background')],
  render: (args, { loaded }) => (
    <BannerImage {...args} {...loaded}>
      <div style={{ color: 'white' }}>This is some text.</div>
    </BannerImage>
  ),
} satisfies StoryObj<typeof BannerImage>;
