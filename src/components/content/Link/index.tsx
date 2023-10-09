import React from 'react';
import {
  Link as _Link,
  LinkProps as _LinkProps,
  NavLink as _NavLink,
  NavLinkProps as _NavLinkProps,
} from 'react-router-dom';

import { Path } from 'app/utils/routes';

export type To = _LinkProps['to'] | Path;

export type LinkProps = Omit<_LinkProps, 'to'> & { to: To };

export function Link({ to, ...args }: LinkProps): JSX.Element {
  if (to instanceof Path) to = to.toString();

  return <_Link to={to} {...args} />;
}

export type NavLinkProps = Omit<_NavLinkProps, 'to'> & { to: To };

export function NavLink({ to, ...args }: NavLinkProps): JSX.Element {
  if (to instanceof Path) to = to.toString();

  return <_NavLink to={to} end {...args} />;
}
