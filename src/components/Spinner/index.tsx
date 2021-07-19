import React from 'react';

import { ReactComponent as SpinnerImage } from 'app/assets/spinner.svg';

import styles from './styles.module.css';

export default function Spinner({
  className,
  size = '1.2em',
}: {
  className?: string;
  size?: React.SVGAttributes<SVGElement>['height'];
}) {
  return (
    <SpinnerImage
      className={[styles.spinner, className].join(' ')}
      height={size}
      width={size}
    />
  );
}
