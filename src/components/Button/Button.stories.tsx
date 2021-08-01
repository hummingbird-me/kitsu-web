import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Button, { ButtonKind } from './index';

export default {
  title: 'Components/Button',
  component: Button,
} as ComponentMeta<typeof Button>;

export const Basic: ComponentStory<typeof Button> = (args) => (
  <Button {...args} />
);

Basic.args = {
  kind: ButtonKind.PRIMARY,
  children: 'Button Label',
  disabled: false,
  loading: false,
};
