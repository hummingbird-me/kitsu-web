import { Meta, StoryFn } from '@storybook/react';
import React from 'react';

import Card from './index';

export default {
  title: 'Surfaces/Card',
  component: Card,
} as Meta<typeof Card>;

export const Basic: StoryFn<typeof Card> = (args) => <Card {...args} />;

Basic.args = {
  children: 'Children go here',
};
