import React, { ComponentProps, useContext } from 'react';
import { LocationDescriptor, Location } from 'history';
import { Link, useLocation } from 'react-router-dom';

import { IsModalContext } from 'app/contexts/ModalContext';
import useQueryParams from 'app/hooks/useQueryParams';

const ModalLink: React.FC<
  {
    component?: React.ElementType;
    to:
      | LocationDescriptor<{
          background?: Location;
          [key: string]: any;
        }>
      | string;
  } & ComponentProps<Link>
> = function ModalLink({ component: Component = Link, to, ...args }) {
  const isModal = useContext(IsModalContext);
  const query = useQueryParams();
  const location = useLocation<{ background?: Location }>();
  const background =
    location.state?.background ?? (isModal ? undefined : location);
  const returnTo = background?.pathname ?? query.get('returnTo');

  if (typeof to === 'string') {
    const url = new URL(to, window.location.href);
    const search = new URLSearchParams(url.search);
    if (returnTo) search.append('returnTo', returnTo);

    to = {
      pathname: to,
      search: search.toString(),
      state: { background },
    };
  } else {
    const search = new URLSearchParams(to.search);
    if (returnTo) search.append('returnTo', returnTo);

    to = {
      ...to,
      search: search.toString(),
      state: { background, ...(to.state ?? {}) },
    };
  }

  return <Component to={to} {...args} />;
};

export default ModalLink;
