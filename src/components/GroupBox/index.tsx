import React from 'react';

import { Link, To as LinkTo } from 'app/components/content/Link';

import styles from './styles.module.css';

export type GroupBoxProps = {
  title: string;
  className?: string;
  children?: React.ReactNode;
  detailsLink?: {
    to: LinkTo;
    text: string;
  };
};

export default function GroupBox({
  children,
  title,
  className,
  detailsLink,
}: GroupBoxProps): JSX.Element {
  return (
    <div className={styles.groupBox}>
      <div className={styles.groupBoxTitle}>
        <span className={styles.groupBoxTitleText}>{title}</span>
      </div>
      <div className={[styles.groupBoxContent, className].join(' ')}>
        {children}
      </div>
      {detailsLink ? (
        <Link className={styles.groupBoxButton} to={detailsLink.to}>
          {detailsLink.text}
        </Link>
      ) : null}
    </div>
  );
}
