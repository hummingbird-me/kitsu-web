import React, { FC, ButtonHTMLAttributes } from 'react';

import styles from './styles.module.css';

export enum ButtonKind {
  PRIMARY = 'primary',
  INVERTED = 'inverted',
  OUTLINE = 'outline',
  DISABLED = 'disabled',
}

const Button: FC<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    kind: ButtonKind;
    loading?: boolean;
    disabled?: boolean;
  }
> = function ({
  kind,
  className,
  children,
  disabled = false,
  loading = false,
  ...args
}) {
  if (disabled) kind = ButtonKind.DISABLED;

  return (
    <button
      {...args}
      disabled={disabled || loading}
      className={[className, styles.button, styles[kind]].join(' ')}>
      {loading ? 'Loading' : children}
    </button>
  );
};

export default Button;
