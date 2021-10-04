import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { withDesign } from 'storybook-addon-designs';

import { ReactComponent as Illustration } from 'app/assets/illustrations/not-found/foreground.svg';
import ErrorPage from './index';

export default {
  title: 'Layouts/Error',
  component: ErrorPage,
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/7KLXsWEmbIbkNy9CnFA0Ke/Kitsu-Web-V4?node-id=423%3A996',
    },
  },
  decorators: [withDesign],
} as ComponentMeta<typeof ErrorPage>;

export const Basic: ComponentStory<typeof ErrorPage> = (args) => (
  <ErrorPage {...args} search={false} illustration={<Illustration />} />
);

Basic.args = {
  title: 'Uh oh, you’re lost!',
  subtitle:
    'We couldn’t find this page. It may have moved, or it may have disappeared into space.',
};
