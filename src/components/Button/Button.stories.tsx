import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import Button, { ButtonKind } from './index';

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    // Seems like the vite version will not properly render out an enum
    // See: https://github.com/eirslett/storybook-builder-vite/issues/79
    kind: {
      options: Object.values(ButtonKind),
      control: { type: 'radio' }
    }
  }
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = args => <Button {...args} />

export const Basic = Template.bind({});
Basic.args = {
  kind: ButtonKind.DISABLED,
  children: 'Label',
  disabled: false,
  loading: false,
};


