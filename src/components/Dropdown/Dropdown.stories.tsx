import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { FaEllipsisH } from 'react-icons/fa';

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
  parameters: {
    layout: 'centered',
  },
  subcomponents: {
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    DropdownItemLink,
  },
} as ComponentMeta<typeof DropdownWrapper>;

export const Basic: ComponentStory<typeof DropdownWrapper> = (args) => (
  <DropdownWrapper {...args} popperOptions={{ placement: 'bottom' }}>
    <DropdownToggle>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid var(--purple)',
          color: 'var(--purple)',
          borderRadius: 50,
          height: 50,
          width: 50,
        }}>
        <FaEllipsisH />
      </div>
    </DropdownToggle>
    <DropdownMenu>
      <DropdownItem>Item 1</DropdownItem>
      <DropdownItem>Item 2</DropdownItem>
    </DropdownMenu>
  </DropdownWrapper>
);

Basic.args = {
  arrow: true,
};
