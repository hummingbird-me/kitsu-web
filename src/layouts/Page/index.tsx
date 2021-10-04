import React, { Suspense, useContext } from 'react';

import { SpinnerBlock } from 'app/components/Spinner';
import { LayoutSettingsContext } from 'app/contexts/LayoutSettingsContext';
import Header from 'app/components/Header';
import Toaster from 'app/components/Toaster/Toaster';

import styles from './styles.module.css';

const LoadingPage = () => <SpinnerBlock className={styles.pageSpinner} />;

const Page: React.FC<{ loading: boolean }> = function ({
  loading = false,
  children,
}) {
  const { layoutSettings } = useContext(LayoutSettingsContext);

  return (
    <>
      <Header {...layoutSettings.header} />
      <Toaster />
      <Suspense fallback={<LoadingPage />}>
        {loading ? <LoadingPage /> : children}
      </Suspense>
    </>
  );
};

export default Page;
