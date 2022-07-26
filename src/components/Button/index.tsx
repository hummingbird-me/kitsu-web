import React, { FC, ButtonHTMLAttributes, useRef } from 'react';

import Spinner from 'app/components/Spinner';

import styles from './styles.module.css';

export enum ButtonKind {
  /** A primary button, generally displayed in green. */
  PRIMARY = 'primary',
  /** A button that only has a border. */
  OUTLINE = 'outline',
  /** A button which cannot be clicked, generally displayed in grey. */
  DISABLED = 'disabled',
  /** A button which has no border, fits as a tertirary button. */
  BORDERLESS = 'borderless',
  /** A button that dispalys well on image distracting backgrounds */
  SCREEN = 'screen',
}

export enum ButtonSize {
  SM = 'small',
  MD = 'medium',
  LG = 'large',
}

export enum ExtendedPadding {
  XS = 'padding-xs',
  SM = 'padding-sm',
  MD = 'padding-md',
  LG = 'padding-lg',
  XL = 'padding-xl',
}

export enum AlternativeColors {
  GREEN = 'green',
  RED = 'red',
  BLUE = 'blue',
  YELLOW = 'yellow',
  GREY = 'safe-grey',
  PURPLE = 'safe-purple',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The kind of button to render */
  kind: ButtonKind;
  /** The size of the button, it scales font-size, y-axis padding and letter-spacing */
  size?: ButtonSize;
  /*A set of altenrative colors are selectable */
  alternativeColor?: AlternativeColors;
  /*This configurates the padding on x-axis */
  extendedPadding?: ExtendedPadding;
  /** Whether the button should be rendered in a loading state. Also disables interactivity, but
   *  does not render a disabled state */
  loading?: boolean;
  /** Whether the button should be disabled (non-interactive) */
  disabled?: boolean;
}

/**
 * The `<Button>` component represents a clickable button, used to submit forms or anywhere in a
 * document for accessible, standard button functionality.  It also provides a loading indicator to
 * inform the user when the button is performing a task.
 */
const Button: FC<ButtonProps> = function ({
  kind,
  size = ButtonSize.MD,
  loading = false,
  alternativeColor,
  extendedPadding = ExtendedPadding.MD,
  disabled = false,
  className,
  children,
  ...args
}: ButtonProps) {
  if (disabled) kind = ButtonKind.DISABLED;

  //presets
  if (kind === 'primary' && !alternativeColor) {
    alternativeColor = AlternativeColors.GREEN;
  } else if (!alternativeColor) {
    alternativeColor = AlternativeColors.GREY;
  }

  return (
    <button
      {...args}
      disabled={disabled || loading}
      className={[
        className,
        styles.button,
        styles[kind],
        styles[size],
        styles[extendedPadding],
        styles[alternativeColor],
      ].join(' ')}>
      {loading ? <Spinner /> : children}
    </button>
  );
};

export default Button;
