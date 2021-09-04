import React from 'react';

import { useToaster } from '../Context';

import styles from './styles.module.css';
import utilStyles from 'app/styles/utils.module.css';

export default function Toaster(): JSX.Element {
  const { items, remove } = useToaster();

  const toasterItems = items.map(({ item, id }) => {
    return item({
      key: id,
      close: () => remove(id),
    });
  });

  return (
    <div className={styles.container}>
      <div className={[utilStyles.container, styles.toaster].join(' ')}>
        {toasterItems}
      </div>
    </div>
  );
}
