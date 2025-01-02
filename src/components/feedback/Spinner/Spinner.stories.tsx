import Spinner, { SpinnerBlock } from './index';

export default {
  title: 'Feedback/Spinner',
  component: Spinner,

  parameters: {
    layout: 'centered',

    controls: {
      expanded: true,
    },
  },
};

export const Default = {
  render: Spinner.bind({}),
  name: 'Default',

  parameters: {
    layout: 'centered',
  },
};

export const Colored = {
  render: Spinner.bind({}),
  name: 'Colored',

  parameters: {
    layout: 'centered',
  },

  args: {
    style: {
      color: 'magenta',
    },
  },
};

export const Block = {
  render: SpinnerBlock.bind({}),
  name: 'Block',
};
