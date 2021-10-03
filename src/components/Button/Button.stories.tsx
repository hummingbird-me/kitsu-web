import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import Button, { ButtonKind } from './index';

export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/7KLXsWEmbIbkNy9CnFA0Ke/Kitsu-Web-V4?node-id=218%3A1210',
    },
  },
  decorators: [withDesign],
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
