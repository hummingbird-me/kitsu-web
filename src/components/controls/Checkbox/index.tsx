import React, { useCallback, useEffect, useRef } from 'react';

import styles from './styles.module.css';

export enum CheckboxState {
  CHECKED = 'checked',
  UNCHECKED = 'unchecked',
  INDETERMINATE = 'indeterminate',
}

type CheckboxProps = {
  state: CheckboxState;
  onChange: (state: CheckboxState) => void;
  label: string;
  disabled: boolean;
};

export default function Checkbox({
  state = CheckboxState.UNCHECKED,
  onChange,
  label,
  disabled,
}: CheckboxProps): JSX.Element {
  const checkboxRef = useRef<HTMLInputElement>(null);
  const onCheckboxChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!onChange) return;
      if (event.target.checked) {
        onChange(CheckboxState.CHECKED);
      } else if (event.target.indeterminate) {
        onChange(CheckboxState.INDETERMINATE);
      } else {
        onChange(CheckboxState.UNCHECKED);
      }
    },
    [onChange]
  );

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = state === CheckboxState.INDETERMINATE;
      checkboxRef.current.checked = state === CheckboxState.CHECKED;
    }
  }, [checkboxRef.current, state]);

  return (
    <label className={styles.container}>
      <input
        type="checkbox"
        className={styles.checkbox}
        ref={checkboxRef}
        onChange={onCheckboxChange}
        disabled={disabled}
      />
      <span className={styles.label}>{label}</span>
    </label>
  );
}
