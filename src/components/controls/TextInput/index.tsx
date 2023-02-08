import React, { InputHTMLAttributes } from 'react';

import styles from './styles.module.css';

export type TextInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'placeholder'
> & {
  label: string;
};

const TextInput = function ({
  className,
  ...props
}: TextInputProps): JSX.Element {
  return <input {...props} className={[className, styles.input].join(' ')} />;
};

export default TextInput;
