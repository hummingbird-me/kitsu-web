import React, { Suspense } from 'react';

import { SpinnerBlock } from 'app/components/Spinner';

import styles from './styles.module.css';

const LoadingPage = () => <SpinnerBlock className={styles.pageSpinner} />;

const Page: React.FC<{ loading: boolean }> = function ({
  loading = false,
  children,
}) {
  return (
    <>
      <Suspense fallback={<LoadingPage />}>
        {loading ? <LoadingPage /> : children}
      </Suspense>
    </>
  );
};

export default Page;
