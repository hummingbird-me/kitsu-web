import React from 'react';
import { FormattedMessage } from 'react-intl';

import Illustration from 'app/assets/illustrations/ice-cube.svg?react';
import ErrorPage from 'app/layouts/Error';

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
