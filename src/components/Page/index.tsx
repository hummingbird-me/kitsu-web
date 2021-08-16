import React, { ComponentProps, Suspense } from 'react';

import Header from 'app/components/Header';
import { SpinnerBlock } from 'app/components/Spinner';

import styles from './styles.module.css';

const LoadedPage: React.FC<{ headerBackground: 'opaque' | 'transparent' }> =
  function ({ children, headerBackground }) {
    return (
      <>
        <Header background={headerBackground} />
        {children}
      </>
    );
  };

const LoadingPage = function () {
  return (
    <>
      <Header background="opaque" />
      <SpinnerBlock className={styles.pageSpinner} />
    </>
  );
};

const Page: React.FC<{
  headerBackground?: 'opaque' | 'transparent';
  loading: boolean;
}> = function ({ headerBackground = 'opaque', loading = false, children }) {
  return (
    <>
      <Suspense fallback={<LoadingPage />}>
        {loading ? (
          <LoadingPage />
        ) : (
          <LoadedPage headerBackground={headerBackground}>
            {children}
          </LoadedPage>
        )}
      </Suspense>
    </>
  );
};

export default Page;
