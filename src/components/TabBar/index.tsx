import React, { ComponentProps, HTMLProps } from 'react';
import { NavLink } from 'react-router-dom';

import styles from './styles.module.css';

export const TabBar: React.FC<HTMLProps<HTMLElement>> = function ({
  children,
  className,
  ...args
}): JSX.Element {
  return (
    <nav className={[className, styles.nav].join(' ')} {...args}>
      <ul className={styles.navList}>{children}</ul>
    </nav>
  );
};

export const TabBarItem: React.FC<HTMLProps<HTMLLIElement>> = function (
  args
): JSX.Element {
  return <li {...args} />;
};

export const TabBarLink: React.FC<ComponentProps<NavLink>> = function ({
  className,
  ...args
}): JSX.Element {
  return (
    <TabBarItem>
      <NavLink className={[className, styles.navLink].join(' ')} {...args} />
    </TabBarItem>
  );
};
