import React from 'react';

import styles from './styles.module.css';

export enum TagColor {
  RED = 'red',
  ORANGE = 'orange',
  GREEN = 'green',
  BLUE = 'blue',
  PURPLE = 'purple',
}

const Tag: React.FC<{ children: string; color: TagColor }> = function ({
  children,
  color,
}) {
  return (
    <span className={[styles.tag, styles[color]].join(' ')}>{children}</span>
  );
};

export default Tag;
