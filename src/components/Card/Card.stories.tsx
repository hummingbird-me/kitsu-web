import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Card from './index';

export default {
  title: 'Components/Card',
  component: Card,
} as ComponentMeta<typeof Card>;

export const Basic: ComponentStory<typeof Card> = (args) => <Card {...args} />;

Basic.args = {
  children: 'Children go here',
};
