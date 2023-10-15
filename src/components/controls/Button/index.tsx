import React, { ButtonHTMLAttributes, FC } from 'react';

import Spinner from 'app/components/feedback/Spinner';

import styles from './styles.module.css';

export enum ButtonKind {
  /** A solid button. Useful anywhere you need something pressable. */
  SOLID = 'solid',
  /** A button with no background, just an outline. Useful for secondary actions and situations
   *  where you want to de-emphasize the button. */
  OUTLINE = 'outline',
  /** A button with no border or background. Useful for tertiary actions. */
  BORDERLESS = 'borderless',
}

export enum ButtonSize {
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
}

export enum ButtonColor {
  RED = 'red',
  PINK = 'pink',
  YELLOW = 'yellow',
  GREEN = 'green',
  BLUE = 'blue',
  PURPLE = 'purple',
  KITSU_PURPLE = 'kitsu-purple',
  GREY = 'grey',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
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
}

/**
 * The `<Button>` component represents a clickable button, used to submit forms or anywhere in a
 * document for accessible, standard button functionality.  It also provides a loading indicator to
 * inform the user when the button is performing a task.
 */
const Button: FC<ButtonProps> = function ({
  kind = ButtonKind.SOLID,
  size = ButtonSize.MEDIUM,
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
        styles.button,
        styles[kind],
        styles[size],
        styles[color],
        loading && styles.loading,
        disabled && styles.disabled,
        className,
      ].join(' ')}>
      {loading ? <Spinner /> : children}
    </button>
  );
};

export default Button;

export const ButtonPreset: { [key: string]: ButtonProps } = {
  PRIMARY: {
    kind: ButtonKind.SOLID,
    color: ButtonColor.GREEN,
  },
};
