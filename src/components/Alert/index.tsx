import React from 'react';

import styles from './styles.module.css';

export type AlertKind = 'success' | 'info' | 'warning' | 'error';

const Alert: React.FC<{ className?: string; kind: AlertKind }> = function ({
  children,
  kind,
  className = '',
}) {
  return (
    <div className={[styles.alert, styles[kind], className].join(' ')}>
      {children}
    </div>
  );
};

export default Alert;
