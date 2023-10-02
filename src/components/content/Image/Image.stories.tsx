import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { source as exampleImage } from 'app/assets/default_poster.jpg?imageSource';
import { imageSourceLoader } from 'app/docs/utilities/uploadToImageSource';

import Image from './index';

export default {
  title: 'Content/Image',
  component: Image,
  parameters: {
    status: {
      type: 'completed',
    },
    layout: 'centered',
  },
  argTypes: {
    source: {
      control: { type: 'file', accept: 'image/*' },
    },
    height: {
      control: { type: 'number' },
      table: {
        category: 'Size',
      },
    },
    width: {
      control: { type: 'number' },
      table: {
        category: 'Size',
      },
    },
    isLoaded: {
      control: { type: 'boolean' },
    },
    objectFit: {
      defaultValue: 'cover',
      table: {
        category: 'Style',
      },
    },
    className: {
      control: { type: 'text' },
      table: {
        category: 'Style',
      },
    },
  },
} satisfies Meta<typeof Image>;

export const Default = {
  name: 'Default',
  loaders: [imageSourceLoader('source')],
  render: ({ height, width, ...args }, { loaded: { source } }) => (
    <Image
      height={height ?? 300}
      width={width ?? 300}
      {...args}
      source={source ?? exampleImage}
    />
  ),
} satisfies StoryObj<typeof Image>;

/**
 * The `contain` object fit will scale the image to fit inside the container, maintaining its aspect
 * ratio and adding padding to the sides as necessary.
 */
export const Contain = {
  name: 'Object Fit: Contain',
  render: ({ ...args }) => (
    <Image
      {...args}
      height={300}
      width={300}
      style={{ border: '1px dashed black' }}
      source={exampleImage}
      objectFit="contain"
    />
  ),
} satisfies StoryObj<typeof Image>;

/**
 * The `cover` object fit will scale the image to fill the container, cropping the image as
 * necessary to maintain its aspect ratio. This is the default object fit, so you don't need to
 * specify it explicitly.
 */
export const Cover = {
  name: 'Object Fit: Cover',
  render: ({ ...args }) => (
    <Image
      {...args}
      height={300}
      width={300}
      style={{ border: '1px dashed black' }}
      source={exampleImage}
      objectFit="cover"
    />
  ),
} satisfies StoryObj<typeof Image>;

/**
 * The `fill` object fit will scale the image to fill the container, ignoring the aspect ratio. This
 * sucks, generally speaking, so you should avoid using it.
 */
export const Fill = {
  name: 'Object Fit: Fill',
  render: ({ ...args }) => (
    <Image
      {...args}
      height={300}
      width={300}
      style={{ border: '1px dashed black' }}
      source={exampleImage}
      objectFit="fill"
    />
  ),
} satisfies StoryObj<typeof Image>;
