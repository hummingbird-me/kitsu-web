import { BsExclamationCircle, BsShieldCheck } from 'react-icons/bs';

import TextInput from './index';

export default {
  title: 'Controls/TextInput',
  component: TextInput,

  argTypes: {
    label: {
      control: {
        type: 'text',
      },
    },
  },

  parameters: {
    layout: 'centered',

    controls: {
      expanded: true,
    },
  },
};

export const Unfilled = {
  render: (args) => {
    return (
      <TextInput
        label="Username"
        style={{
          width: '400px',
        }}
        {...args}
      />
    );
  },

  name: 'Unfilled',

  parameters: {
    layout: 'centered',
  },
};

export const InvalidEmail = {
  render: (args) => {
    return (
      <TextInput
        label="Email Address"
        style={{
          width: '400px',
        }}
        validation={{
          type: 'invalid',
          icon: BsExclamationCircle,
          message: 'There is already an account with this email.',
        }}
        defaultValue="nuck@kitsu.io"
        {...args}
      />
    );
  },

  name: 'Invalid Email',

  parameters: {
    layout: 'centered',
  },
};

export const ValidPassword = {
  render: (args) => {
    return (
      <TextInput
        label="Password"
        style={{
          width: '400px',
        }}
        validation={{
          type: 'valid',
          icon: BsShieldCheck,
          message: "Woah, that's an excellent password!",
        }}
        type="password"
        defaultValue="correct horse battery staple"
        {...args}
      />
    );
  },

  name: 'Valid Password',

  parameters: {
    layout: 'centered',
  },
};

export const Search = {
  render: (args) => {
    return (
      <TextInput
        label="Search for Anime or Manga..."
        style={{
          width: '400px',
        }}
        type="search"
        defaultValue="Attack on Titan"
        {...args}
      />
    );
  },

  name: 'Search',

  parameters: {
    layout: 'centered',
  },
};

export const Month = {
  render: (args) => {
    return (
      <TextInput
        label="Month"
        style={{
          width: '400px',
        }}
        type="month"
        defaultValue="Junuary"
        {...args}
      />
    );
  },

  name: 'Month',

  parameters: {
    layout: 'centered',
  },
};
