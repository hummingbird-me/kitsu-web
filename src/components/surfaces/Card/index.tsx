import React, { HTMLProps } from 'react';

import styles from './styles.module.css';

/**
 * A "card" is a component for displaying content over the background of the page
 */
const Card: React.FC<HTMLProps<HTMLDivElement>> = function ({
  className,
  ...args
}) {
  return <div className={[styles.card, className].join(' ')} {...args} />;
};

export default Card;
