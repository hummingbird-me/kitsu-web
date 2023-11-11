import React from 'react';
import {
  To as _To,
  Link as _Link,
  LinkProps as _LinkProps,
  NavLink as _NavLink,
  NavLinkProps as _NavLinkProps,
} from 'react-router-dom';

import { Path, PathTree, PATH_TREE_BASE } from 'app/utils/routes';

export type To = _To | Path | PathTree;

/**
 * Converts our own "To" type into the react-router-dom "To" type. Has a funny name.
 * 
 * @param path The path to convert.
 * @returns The converted path.
 */
function toToTo(path: To): _To {
  if (typeof path === 'string') return path;
  if (PATH_TREE_BASE in path) return path[PATH_TREE_BASE].toString();
  if (path instanceof Path) return path.toString();

  return path;
}

export type LinkProps = Omit<_LinkProps, 'to'> & { to: To };

export function Link({ to, ...args }: LinkProps): JSX.Element {
  return <_Link to={toToTo(to)} {...args} />;
}

export type NavLinkProps = Omit<_NavLinkProps, 'to'> & { to: To };

export function NavLink({ to, ...args }: NavLinkProps): JSX.Element {
  // Handle PathTree objects by checking for _base
  if (typeof to !== 'string' && PATH_TREE_BASE in to && to[PATH_TREE_BASE]) to = to[PATH_TREE_BASE];
  if (to instanceof Path) to = to.toString();

  return <_NavLink to={toToTo(to)} end {...args} />;
}
