import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import {
  Wrapper as DropdownWrapper,
  Toggle as DropdownToggle,
  Menu as DropdownMenu,
  Item as DropdownItem,
  ItemLink as DropdownItemLink,
} from './index';

export default {
  title: 'Components/Dropdown',
  component: DropdownWrapper,
  subcomponents: {
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    DropdownItemLink,
  },
} as ComponentMeta<typeof DropdownWrapper>;

export const Basic: ComponentStory<typeof DropdownWrapper> = (args) => (
  <DropdownWrapper {...args} popperOptions={{ placement: 'bottom' }}>
    <DropdownToggle>Toggle</DropdownToggle>
    <DropdownMenu>
      <DropdownItem>Item 1</DropdownItem>
      <DropdownItem>Item 2</DropdownItem>
    </DropdownMenu>
  </DropdownWrapper>
);

Basic.args = {
  arrow: true,
};
