import React, { FC, InputHTMLAttributes } from 'react';

import styles from './styles.module.css';

const TextInput: FC<InputHTMLAttributes<HTMLInputElement>> = function ({
  className,
  ...props
}) {
  return <input {...props} className={[className, styles.input].join(' ')} />;
};

export default TextInput;
