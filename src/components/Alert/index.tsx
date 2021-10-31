import React from 'react';
import { FaTimes } from 'react-icons/fa';

import styles from './styles.module.css';

export type AlertKind = 'success' | 'info' | 'warning' | 'error';

const Alert: React.FC<{
  className?: string;
  onDismiss?: () => void;
  kind: AlertKind;
}> = function ({ children, kind, onDismiss, className = '' }) {
  return (
    <div className={[styles.alert, styles[kind], className].join(' ')}>
      <div>{children}</div>
      {onDismiss && (
        <button className={styles.dismiss} onClick={onDismiss}>
          <FaTimes />
        </button>
      )}
    </div>
  );
};

export default Alert;
