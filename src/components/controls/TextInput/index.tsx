import React, { InputHTMLAttributes, forwardRef } from 'react';

import FormField, {
  FormFieldValidationProps,
} from 'app/components/controls/Field';

export type TextInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'placeholder'
> & { label: string; validation?: FormFieldValidationProps };

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
  }
);

export default TextInput;
