import { Meta, StoryObj } from '@storybook/react';

import Checkbox, { CheckboxState } from './index';

export default {
  title: 'Controls/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/QnRsGDTY1hcHmeFX0seHqd/Kitsu-Design-(Universal)?node-id=26%3A173&t=LrJkeenEpm0NXeUW-1',
    },
  },
} satisfies Meta<typeof Checkbox>;

export const Unchecked = {
  name: 'State: Unchecked',
  args: {
    label: 'Delete my information',
    state: CheckboxState.UNCHECKED,
  },
} satisfies StoryObj<typeof Checkbox>;

export const Checked = {
  name: 'State: Checked',
  args: {
    label: 'Receive email notifications',
    state: CheckboxState.CHECKED,
  },
} satisfies StoryObj<typeof Checkbox>;

export const Indeterminate = {
  name: 'State: Indeterminate',
  args: {
    label: 'Be uncertain',
    state: CheckboxState.INDETERMINATE,
  },
} satisfies StoryObj<typeof Checkbox>;

export const Disabled = {
  name: 'State: Disabled',
  args: {
    label: 'This is mandatory',
    state: CheckboxState.CHECKED,
    disabled: true,
  },
} satisfies StoryObj<typeof Checkbox>;
