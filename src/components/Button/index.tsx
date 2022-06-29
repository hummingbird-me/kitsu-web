import React, {
  FC,
  ButtonHTMLAttributes,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

import Spinner from 'app/components/Spinner';

import styles from './styles.module.css';
import useMatchTheme, { themes } from 'app/hooks/useMatchTheme';

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

export enum ButtonPreset {
  CONFIRM = 'confirm',
  WARN = 'warning',
  ALERT = 'alert',
}

export enum HoverBehaviour {
  LIGHTEN = 'bg-lighten',
  DARKEN = 'bg-darken',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The kind of button to render */
  kind: ButtonKind;
  /** The size of the button, it scales font-size, y-axis padding and letter-spacing */
  size?: ButtonSize;
  /*A set of altenrative colors are selectable */
  alternativeColor?: AlternativeColors;
  /*This configurates the hover visual contrast, multiple properties are set */
  hoverBehaviour?: HoverBehaviour;
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
  hoverBehaviour = HoverBehaviour.DARKEN,
  extendedPadding = ExtendedPadding.MD,
  disabled = false,
  className,
  children,
  ...args
}: ButtonProps) {
  if (disabled) kind = ButtonKind.DISABLED;
  let ref = useRef<HTMLButtonElement>(null);
  let theme = useMatchTheme();

  useLayoutEffect(() => {
    //presets

    if (kind === 'primary' && !alternativeColor) {
      alternativeColor = AlternativeColors.GREEN;
    }
    //if no priorties - default to grey;
    if (!alternativeColor) alternativeColor = AlternativeColors.GREY;

    let CSSColorReassignment = {
      '--defaultColor': `var(--${alternativeColor})`,
      '--lighten-100': `var(--button-lighten-${alternativeColor}-100)`,
      '--lighten-200': `var(--button-lighten-${alternativeColor}-200)`,
      '--darken-100': `var(--button-darken-${alternativeColor}-100)`,
      '--darken-200': `var(--button-darken-${alternativeColor}-200)`,
    };

    let CSSDarkBgColorReassignment = {
      '--background-contrast-100': `var(--button-translucent-${alternativeColor}-5)`,
      '--background-contrast-200': `var(--button-translucent-${alternativeColor}-25)`,
    };

    if (
      (theme == 'theme-dark' || theme == 'theme-oled') &&
      (kind == 'outline' || kind == 'borderless')
    ) {
      //brighten text color anyways for dark theme
      CSSColorReassignment[
        '--darken-100'
      ] = `var(--button-lighten-${alternativeColor}-100)`;
      CSSColorReassignment[
        '--darken-200'
      ] = `var(--button-lighten-${alternativeColor}-200)`;
      for (let [key, value] of Object.entries(CSSColorReassignment)) {
        ref?.current?.style.setProperty(key, value);
      }
    } else {
      for (let [key, value] of Object.entries(CSSColorReassignment)) {
        ref?.current?.style.setProperty(key, value);
      }
    }

    if (
      theme == 'theme-dark' ||
      (theme == 'theme-oled' && (kind == 'outline' || kind == 'borderless'))
    ) {
      //add contrast transucency to backgrounds of specified kind
      for (let [key, value] of Object.entries(CSSDarkBgColorReassignment)) {
        ref?.current?.style.setProperty(key, value);
      }
    } else {
      for (let [key, value] of Object.entries(CSSDarkBgColorReassignment)) {
        ref?.current?.style.setProperty(key, 'transparent');
      }
    }
  }, [kind, alternativeColor, theme]);

  useEffect(() => {
    //reappend the transition duration after the style has applied.
    //this will prevent initial transition from base color.
    ref?.current?.style.setProperty('transition-duration', '100ms');
  }, []);

  return (
    <button
      {...args}
      disabled={disabled || loading}
      ref={ref}
      className={[
        className,
        styles.button,
        styles[kind],
        styles[size],
        styles[hoverBehaviour],
        styles[extendedPadding],
      ].join(' ')}>
      {loading ? <Spinner /> : children}
    </button>
  );
};

export default Button;
