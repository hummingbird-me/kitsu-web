import React, { type ButtonHTMLAttributes } from 'react';

import Spinner from 'app/components/feedback/Spinner';

import styles from './styles.module.css';

/**
 * @deprecated Just use strings instead.
 */
export const ButtonKind = {
  SOLID: 'solid',
  OUTLINE: 'outline',
  BORDERLESS: 'borderless',
} as const;

export type ButtonKind = 'solid' | 'outline' | 'borderless';

/**
 * @deprecated Just use strings instead.
 */
export const ButtonSize = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
} as const;

export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * @deprecated Just use strings instead.
 */
export const ButtonColor = {
  RED: 'red',
  PINK: 'pink',
  YELLOW: 'yellow',
  GREEN: 'green',
  BLUE: 'blue',
  PURPLE: 'purple',
  KITSU_PURPLE: 'kitsu-purple',
  GREY: 'grey',
} as const;

export type ButtonColor =
  | 'red'
  | 'pink'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'kitsu-purple'
  | 'grey';

export type ButtonProps = {
  children: React.ReactNode;
  /** The kind of button to render */
  kind: ButtonKind;
  /** The size of the button, scaling font-size, padding and letter-spacing */
  size?: ButtonSize;
  /** The primary color of the button */
  color: ButtonColor;
  /** Whether the button should be rendered in a loading state. Also disables interactivity, but
   *  does *not* render a disabled state */
  loading?: boolean;
  /** Whether the button should be non-interactive; disables pointer events and styles the button
   *  accordingly. */
  disabled?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * The `<Button>` component represents a clickable button, used to submit forms or anywhere in a
 * document for accessible, standard button functionality.  It also provides a loading indicator to
 * inform the user when the button is performing a task.
 */
const Button = function ({
  kind = 'solid',
  size = 'medium',
  color,
  loading = false,
  disabled = false,
  className,
  children,
  ...args
}: ButtonProps) {
  return (
    <button
      {...args}
      disabled={disabled}
      className={[
        styles.Button,
        styles[kind],
        styles[size],
        styles[color],
        loading && styles.loading,
        disabled && styles.disabled,
        className,
      ].join(' ')}>
      <div className={styles.Content}>{children}</div>
      <div className={styles.Spinner}>
        <Spinner />
      </div>
    </button>
  );
};

export default Button;

export const ButtonPreset: { [key: string]: Partial<ButtonProps> } = {
  PRIMARY: {
    kind: 'solid',
    color: 'green',
  },
};
