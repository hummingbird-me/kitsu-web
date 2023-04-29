import React from 'react';
import { BsX } from 'react-icons/bs';

import styles from './styles.module.css';

export enum TagColor {
  RED = 'red',
  PINK = 'pink',
  YELLOW = 'yellow',
  GREEN = 'green',
  BLUE = 'blue',
  PURPLE = 'purple',
  KITSU_PURPLE = 'kitsuPurple',
  GREY = 'grey',
}

export type TagProps = {
  children: string;
  color: TagColor;
  onRemove?: React.MouseEventHandler<HTMLElement>;
  onClick?: React.MouseEventHandler<HTMLElement>;
};

export default function Tag({
  children,
  color,
  onRemove,
  onClick,
}: TagProps): JSX.Element {
  return (
    <span
      className={[
        styles.tag,
        styles[color],
        onClick ? styles.clickable : null,
        onRemove ? styles.removable : null,
      ].join(' ')}>
      <span className={styles.text}>{children}</span>
      {onRemove ? (
        <span className={styles.removeButton} onClick={onRemove}>
          <BsX />
        </span>
      ) : null}
    </span>
  );
}
