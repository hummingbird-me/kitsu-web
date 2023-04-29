import { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import Tag, { TagColor } from './index';

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
    color: TagColor.PURPLE,
    onClick: undefined,
    onRemove: undefined,
  },
  render: Tag,
} satisfies StoryObj<typeof Tag>;

export const Clickable = {
  name: 'Clickable',
  args: {
    children: 'Clickable Tag',
    color: TagColor.YELLOW,
    onRemove: undefined,
  },
  render: Tag,
} satisfies StoryObj<typeof Tag>;

export const Removable = {
  name: 'Removable',
  args: {
    children: 'Removable Tag',
    color: TagColor.GREEN,
    onClick: undefined,
  },
  render: Tag,
} satisfies StoryObj<typeof Tag>;
