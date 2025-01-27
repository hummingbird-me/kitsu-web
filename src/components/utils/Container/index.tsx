import React from 'react';

import styles from './styles.module.css';

export default function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={[styles.Container, className].join(' ')}>{children}</div>
  );
}
