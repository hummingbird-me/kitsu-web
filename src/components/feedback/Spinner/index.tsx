import React, { type HTMLProps } from 'react';

import SpinnerImage from 'app/assets/spinner.svg?react';

import styles from './styles.module.css';

/**
 * Spinners are a compact way to tell the user "hey, we're doing something, just wait a sec".
 *
 * Works especially well on buttons, in the margins, or to represent processing of something in the
 * background. If you're loading a whole page or section, you should prefer a Skeleton.
 *
 * The spinner is displayed in the text color of the context it's placed in, and defaults to `3em`
 * size. You can pass `style` or `className` props to override the style, including color. You can
 * change the size by passing a value to `size`. Just... please don't actually color it magenta, okay?
 *
 * For users with reduced motion, the spinner is significantly slowed down to a 3-second animation.
 *
 * @param className
 * @param style
 * @param size
 * @constructor
 */
export default function Spinner({
  className,
  style,
  size = '1.2em',
}: {
  className?: string;
  style?: React.CSSProperties;
  size?: React.SVGAttributes<SVGElement>['height'];
}) {
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
