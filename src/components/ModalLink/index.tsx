import React, { ComponentProps, useContext } from 'react';
import { Location, parsePath, createPath } from 'history';
import { Link, useLocation } from 'react-router-dom';

import { IsModalContext } from 'app/contexts/ModalContext';
import useQueryParams from 'app/hooks/useQueryParams';

function useBackgroundLocation(): Location | undefined {
  const isModal = useContext(IsModalContext);
  const location = useLocation() as Location & {
    state?: { background?: Location };
  };
  const { background } = location.state ?? {};

  if (isModal) return background;

  return background ?? location;
}

const ModalLink: React.FC<
  {
    component?: React.ElementType;
  } & ComponentProps<typeof Link>
> = function ModalLink({ component: Component = Link, to, ...args }) {
  const query = useQueryParams();
  const background = useBackgroundLocation();
  const returnTo = background?.pathname ?? query.get('returnTo');

  if (typeof to === 'string') {
    // When we get a string we need to parse it to add our returnTo query param
    const url = new URL(to, window.location.href);
    const search = new URLSearchParams(url.search);
    if (returnTo) search.append('returnTo', returnTo);

    to = {
      pathname: to,
      search: search.toString(),
    };
  } else {
    const search = new URLSearchParams(to.search);
    if (returnTo) search.append('returnTo', returnTo);

    to = {
      ...to,
      search: search.toString(),
    };
  }

  return <Component to={to} state={{ background }} {...args} />;
};

export default ModalLink;
