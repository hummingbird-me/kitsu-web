import React, { FC } from 'react';

import styles from './styles.module.css';

const Rule: FC<{ label: string }> = function ({ label }) {
  return <div className={styles.rule}>{label}</div>;
};

export default Rule;
