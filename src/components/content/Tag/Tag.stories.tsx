import { type Meta, type StoryObj } from '@storybook/react';
import React from 'react';

import Tag from './index';

export default {
  title: 'Content/Tag',
  component: Tag,
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/QnRsGDTY1hcHmeFX0seHqd/Kitsu-Design-(Universal)?node-id=1%3A61&t=HlKpTxteBZcB4Z60-1',
    },
  },
} satisfies Meta<typeof Tag>;

export const Default = {
  name: 'Default',
  args: {
    children: 'Basic Tag',
    color: 'purple',
    onClick: undefined,
    onRemove: undefined,
  },
  render: Tag,
} satisfies StoryObj<typeof Tag>;

export const Clickable = {
  name: 'Clickable',
  args: {
    children: 'Clickable Tag',
    color: 'yellow',
    onRemove: undefined,
  },
  render: Tag,
} satisfies StoryObj<typeof Tag>;

export const Removable = {
  name: 'Removable',
  args: {
    children: 'Removable Tag',
    color: 'green',
    onClick: undefined,
  },
  render: Tag,
} satisfies StoryObj<typeof Tag>;
