import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { FaTrash } from 'react-icons/fa';

import Button, { ButtonColor, ButtonKind, ButtonPreset } from './index';

export default {
  title: 'Controls/Button',
  component: Button,
  parameters: {
    status: 'released',
    layout: 'centered',
    controls: { expanded: true },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/QnRsGDTY1hcHmeFX0seHqd/Kitsu-Design-(Universal)?node-id=6%3A378&t=LrJkeenEpm0NXeUW-1',
    },
  },
} satisfies Meta<typeof Button>;

export const Solid = {
  name: 'Kind: Solid',
  argTypes: {
    kind: { table: { disable: true } },
  },
  args: {
    children: 'Watch Trailer',
    color: ButtonColor.PURPLE,
  },
  render: (args) => <Button {...args} kind={ButtonKind.SOLID} />,
} satisfies StoryObj<typeof Button>;

export const Outline = {
  name: 'Kind: Outline',
  argTypes: {
    kind: { table: { disable: true } },
  },
  args: {
    children: 'Cancel',
    color: ButtonColor.RED,
  },
  render: (args) => <Button {...args} kind={ButtonKind.OUTLINE} />,
} satisfies StoryObj<typeof Button>;

export const Borderless = {
  name: 'Kind: Borderless',
  argTypes: {
    kind: { table: { disable: true } },
  },
  args: {
    children: 'Cancel',
    color: ButtonColor.RED,
  },
  render: (args) => <Button {...args} kind={ButtonKind.BORDERLESS} />,
} satisfies StoryObj<typeof Button>;

export const Primary = {
  name: 'Preset: Primary',
  args: {
    children: 'Create Account',
  },
  render: (args) => <Button {...ButtonPreset.PRIMARY} {...args} />,
} satisfies StoryObj<typeof Button>;

export const Disabled = {
  name: 'State: Disabled',
  argTypes: {
    disabled: { table: { disable: true } },
  },
  args: {
    color: ButtonColor.PURPLE,
    children: 'Change Password',
  },
  render: (args) => <Button {...args} disabled />,
} satisfies StoryObj<typeof Button>;

export const Loading = {
  name: 'State: Loading',
  argTypes: {
    loading: { table: { disable: true } },
  },
  args: {
    color: ButtonColor.BLUE,
    children: 'Create Account',
  },
  render: (args) => <Button {...args} loading />,
} satisfies StoryObj<typeof Button>;

export const WithIcon = {
  name: 'With: Icon',
  argTypes: {
    children: { table: { disable: true } },
  },
  args: {
    color: ButtonColor.RED,
  },
  render: (args) => (
    <Button {...args}>
      <FaTrash /> Delete Item
    </Button>
  ),
} satisfies StoryObj<typeof Button>;
