import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { withDesign } from 'storybook-addon-designs';

import illustrationSrc from 'app/assets/illustrations/not-found.svg';

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
} as Meta<typeof ErrorPage>;

export const Basic: StoryObj<typeof ErrorPage> = {
  render(args) {
    return (
      <ErrorPage
        {...args}
        search={false}
        illustration={<img src={illustrationSrc} />}
      />
    );
  },
  args: {
    title: 'Uh oh, you’re lost!',
    subtitle:
      'We couldn’t find this page. It may have moved, or it may have disappeared into space.',
  },
};
