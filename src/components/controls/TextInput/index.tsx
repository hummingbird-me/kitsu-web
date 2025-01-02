import React, { forwardRef, type InputHTMLAttributes } from 'react';

import FormField, {
  type FormFieldValidationProps,
} from 'app/components/controls/Field';

export type TextInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'placeholder'
> & { label: string; validation?: FormFieldValidationProps };

/**
 * Text inputs are used to collect short textual information, such as names, email
 * addresses, passwords, phone numbers, and more. In theory, this component
 * supports any input type you want, but in practice it's only styled for the
 * following `type=` values:
 *
 * * `email`
 * * `password`
 * * `text`
 * * `url`
 * * `tel`
 *
 * Generally, if it's styled like a text input, it's supported by TextInput. For
 * everything else, there are other components that are more appropriate and have
 * their own particular styles. One notable exception is `type="number"`, which is
 * *not* supported by TextInput. If you need a number input, use the `NumberInput`
 * component, which provides styled, accessible input controls for incrementing and
 * decrementing numbers.
 */
const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput({ className, label, validation, ...props }, ref) {
    return (
      <FormField label={label} validation={validation}>
        {(fieldProps) => (
          <input
            {...props}
            {...fieldProps}
            ref={ref}
            className={[className, fieldProps.className].join(' ')}
          />
        )}
      </FormField>
    );
  },
);

export default TextInput;
