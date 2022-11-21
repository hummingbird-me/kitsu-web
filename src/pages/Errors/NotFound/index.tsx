import React from 'react';
import { FormattedMessage } from 'react-intl';

import illustration from 'app/assets/illustrations/not-found.svg?url';
import ErrorPage from 'app/layouts/Error';

export default function NotFoundPage(): JSX.Element {
  return (
    <ErrorPage
      title={<FormattedMessage defaultMessage="Uh oh, you're lost!" />}
      subtitle={
        <FormattedMessage defaultMessage="We couldn’t find this page. It may have moved, or it may have disappeared into space." />
      }
      illustration={<img src={illustration} />}
      search={false}
    />
  );
}
