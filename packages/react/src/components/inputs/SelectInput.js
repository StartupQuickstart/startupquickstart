import React, { useEffect, useMemo, useState } from 'react';
import { Form } from 'react-bootstrap';

export function SelectInput({
  id = Date.now(),
  label = 'Select Input',
  placeholder = 'Select Option',
  options = [],
  value,
  onChange = () => {},
  onBlur,
  touched = {},
  errors = {},
  disabled,
  className,
  required,
  size = 'md',
  helpText,
  type = 'text',
  showErrors,
  ...props
}) {
  const [_value, setValue] = useState(value);

  useEffect(() => {
    setValue(value);
  }, [value]);

  const _options = useMemo(() => {
    return options.map((option) => {
      if (typeof option === 'string') {
        return { value: option, label: option };
      } else if (typeof option === 'object') {
        if (option.value === undefined || option.label === undefined) {
          throw new Error('Select options require value and label keys');
        }

        return option;
      } else {
        throw new Error(`${typeof option} is not a valid option type`);
      }
    });
  }, [options]);

  return (
    <Form.Select
      {...props}
      id={id}
      className={`form-control-${size}`}
      onChange={(e) => {
        const value = e.target.value;
        onChange(value);
        setValue(value);
      }}
      onBlur={onBlur}
      isInvalid={touched[id] && errors[id]}
      disabled={disabled}
      required={required}
      value={_value || ''}
    >
      <option>{placeholder}</option>
      {_options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </Form.Select>
  );
}

export default SelectInput;
