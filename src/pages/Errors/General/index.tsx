import React from 'react';
import { FormattedMessage } from 'react-intl';

import ErrorPage from 'app/layouts/Error';
import { ReactComponent as Illustration } from 'app/assets/illustrations/ice-cube.svg';

import styles from './styles.module.css';

export default function NotFoundPage(): JSX.Element {
  return (
    <ErrorPage
      title={<FormattedMessage defaultMessage="Uh oh!" />}
      subtitle={
        <FormattedMessage defaultMessage="Something went wrong, why don't you try that again in a few minutes?" />
      }
      illustration={<Illustration />}
      search={false}
    />
  );
}
