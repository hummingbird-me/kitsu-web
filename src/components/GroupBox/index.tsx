import React from 'react';

import styles from './styles.module.css';

const GroupBox: React.FC<{ title: string; className?: string }> = function ({
  children,
  title,
  className,
}) {
  return (
    <div className={styles.groupBox}>
      <div className={styles.groupBoxTitle}>
        <span className={styles.groupBoxTitleText}>{title}</span>
      </div>
      <div className={[styles.groupBoxContent, className].join(' ')}>
        {children}
      </div>
    </div>
  );
};

export default GroupBox;
