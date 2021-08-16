import React, { Suspense } from 'react';

import Header from 'app/components/Header';
import Spinner from 'app/components/Spinner';

const Page: React.FC<{
  headerBackground?: 'opaque' | 'transparent';
  loading: boolean;
}> = function ({ headerBackground = 'opaque', loading = false, children }) {
  return (
    <>
      <Header background={headerBackground} />
      <Suspense fallback={<Spinner />}>
        {loading ? <Spinner /> : children}
      </Suspense>
    </>
  );
};

export default Page;
