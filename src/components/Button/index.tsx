import React, {
  FC,
  ButtonHTMLAttributes,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';

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

  /** !! Since Darkmode on Storyboard not fully set up,  I quick fix here for now  !! */
  theme: 'dark' | 'light';
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
  alternativeColor = AlternativeColors.GREY,
  hoverBehaviour = HoverBehaviour.DARKEN,
  extendedPadding = ExtendedPadding.MD,
  theme = 'light',
  disabled = false,
  className,
  children,
  ...args
}: ButtonProps) {
  if (disabled) kind = ButtonKind.DISABLED;
  let ref = useRef<HTMLButtonElement>(null);
  useLayoutEffect(() => {
    // let themeMode = document.querySelector('html')?.dataset.theme ?? 'light';
    // theme = 'dark';
    console.log(theme);
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
    for (let [key, value] of Object.entries(CSSColorReassignment)) {
      ref?.current?.style.setProperty(key, value);
    }

    if (theme == 'dark' && (kind == 'outline' || kind == 'borderless')) {
      for (let [key, value] of Object.entries(CSSDarkBgColorReassignment)) {
        ref?.current?.style.setProperty(key, value);
      }
    } else {
      for (let [key, value] of Object.entries(CSSDarkBgColorReassignment)) {
        ref?.current?.style.setProperty(key, 'transparent');
      }
    }
  }, [kind, alternativeColor, theme]);

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
