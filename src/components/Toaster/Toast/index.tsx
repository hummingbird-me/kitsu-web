import React from 'react';
import { FaTimes } from 'react-icons/fa';

import styles from './styles.module.css';

const Toast: React.FC<
  React.HTMLProps<HTMLDivElement> & {
    onClose: () => void;
  }
> = function ({ children, onClose, ...args }) {
  return (
    <div className={styles.toast} {...args}>
      <div className={styles.content}>{children}</div>
      {onClose && <FaTimes className={styles.closeButton} onClick={onClose} />}
    </div>
  );
};

export default Toast;
