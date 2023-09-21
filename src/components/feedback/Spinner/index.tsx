import React, { HTMLProps } from 'react';

import SpinnerImage from 'app/assets/spinner.svg?react';

import styles from './styles.module.css';

export default function Spinner({
  className,
  style,
  size = '1.2em',
}: {
  className?: string;
  style?: React.CSSProperties;
  size?: React.SVGAttributes<SVGElement>['height'];
}): JSX.Element {
  return (
    <SpinnerImage
      style={style}
      className={[styles.spinner, className].join(' ')}
      height={size}
      width={size}
    />
  );
}

export const SpinnerBlock: React.FC<
  HTMLProps<HTMLDivElement> & {
    size?: React.SVGAttributes<SVGElement>['height'];
  }
> = function ({ size = '3em', className, ...props }) {
  return (
    <div className={[styles.spinnerBlock, className].join(' ')} {...props}>
      <Spinner size={size} />
    </div>
  );
};
