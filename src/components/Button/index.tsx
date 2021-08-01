import React, { FC, ButtonHTMLAttributes } from 'react';

import Spinner from 'app/components/Spinner';

import styles from './styles.module.css';

export enum ButtonKind {
  /** A primary button, generally displayed in green. */
  PRIMARY = 'primary',
  /** An inverted button style, generally displayed in white on a dark background. */
  INVERTED = 'inverted',
  /** A button that only has a border. */
  OUTLINE = 'outline',
  /** A button which cannot be clicked, generally displayed in grey. */
  DISABLED = 'disabled',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The kind of button to render */
  kind: ButtonKind;
  /** Whether the button should be rendered in a loading state. Also disables interactivity, but
   *  does not render a disabled state */
  loading?: boolean;
  /** Whether the button should be disabled (non-interactive) */
  disabled?: boolean;
}

/** A button component. */
const Button: FC<ButtonProps> = function ({
  kind,
  loading = false,
  disabled = false,
  className,
  children,
  ...args
}: ButtonProps) {
  if (disabled) kind = ButtonKind.DISABLED;

  return (
    <button
      {...args}
      disabled={disabled || loading}
      className={[className, styles.button, styles[kind]].join(' ')}>
      {loading ? <Spinner /> : children}
    </button>
  );
};

export default Button;
