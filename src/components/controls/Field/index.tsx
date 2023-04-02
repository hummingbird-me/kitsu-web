import isEqual from 'lodash-es/isEqual';
import React, { memo, useId } from 'react';

import styles from './styles.module.css';

export type FormFieldValidationProps = {
  type?: 'valid' | 'invalid';
  icon?: () => JSX.Element;
  message?: string;
};

export type FormFieldChildProps = {
  placeholder: string;
  id: string;
  className: string;
};

export type FormFieldProps = {
  label: string;
  className?: string;
  style?: React.CSSProperties;
  validation?: FormFieldValidationProps;
  children: (props: FormFieldChildProps) => JSX.Element;
  actionIcon?: () => JSX.Element;
  onActionIconClicked?: () => void;
};

export default memo(
  function FormField({
    label,
    className,
    style,
    validation,
    actionIcon,
    onActionIconClicked,
    children,
  }: FormFieldProps) {
    const Icon = validation?.icon;
    const ActionIcon = actionIcon;
    const fieldId = useId();

    return (
      <div
        style={style}
        className={[
          className,
          styles.container,
          validation?.icon && styles.hasIcon,
          validation?.type && styles[validation?.type],
        ].join(' ')}>
        <div className={styles.inputContainer}>
          {children({
            placeholder: label,
            id: fieldId,
            className: styles.input,
          })}
          <div className={styles.labelContainer}>
            <label className={styles.label} htmlFor={fieldId}>
              {label}
            </label>
          </div>
          {Icon && (
            <div className={styles.icon}>
              <Icon />
            </div>
          )}
          {ActionIcon && (
            <div className={styles.actionIcon} onClick={onActionIconClicked}>
              <ActionIcon />
            </div>
          )}
        </div>
        {validation?.message && (
          <div className={styles.error}>{validation?.message}</div>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.label === nextProps.label &&
      prevProps.className === nextProps.className &&
      isEqual(prevProps.style, nextProps.style) &&
      isEqual(prevProps.validation, nextProps.validation) &&
      prevProps.actionIcon === nextProps.actionIcon &&
      prevProps.onActionIconClicked === nextProps.onActionIconClicked &&
      prevProps.children === nextProps.children
    );
  }
);
