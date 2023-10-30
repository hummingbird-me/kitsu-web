import React, { HTMLProps } from 'react';

import { NavLink, NavLinkProps } from 'app/components/content/Link';
import { Path } from 'app/utils/routes';

import styles from './styles.module.css';

type TabBarProps = HTMLProps<HTMLElement> & { children: React.ReactNode };
const TabBar = function ({
  children,
  className,
  ...args
}: TabBarProps): JSX.Element {
  return (
    <nav className={[className, styles.nav].join(' ')} {...args}>
      <ul className={styles.navList}>{children}</ul>
    </nav>
  );
};

type TabBarItemProps = HTMLProps<HTMLLIElement> & { children: React.ReactNode };
TabBar.Item = function TabBarItem(args: TabBarItemProps): JSX.Element {
  return <li {...args} />;
};

TabBar.LinkItem = function TabBarLinkItem({
  className,
  to,
  ...args
}: NavLinkProps): JSX.Element {
  if (to instanceof Path) to = to.toString();

  return (
    <TabBar.Item>
      <NavLink
        className={[className, styles.navLink].join(' ')}
        to={to}
        {...args}
      />
    </TabBar.Item>
  );
};

export default TabBar;
