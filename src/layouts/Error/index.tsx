import React from 'react';

import { HeaderSettings } from 'app/contexts/LayoutSettingsContext';
import Page from 'app/layouts/Page';
import utilStyles from 'app/styles/utils.module.css';

import styles from './styles.module.css';

const ErrorLayout: React.FC<{
  illustration: React.ReactNode;
  title: React.ReactNode;
  subtitle: React.ReactNode;
  search: boolean;
}> = function ({ illustration, title, subtitle, search }): JSX.Element {
  return (
    <Page loading={false}>
      <HeaderSettings background="opaque" />
      <div className={[utilStyles.center, styles.container].join(' ')}>
        <div className={styles.content}>
          <div className={styles.illustration}>{illustration}</div>
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.subtitle}>{subtitle}</div>
        </div>
      </div>
    </Page>
  );
};

export default ErrorLayout;
