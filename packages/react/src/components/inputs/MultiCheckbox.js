import React from 'react';
import { FieldArray } from 'formik';
import { Form } from 'react-bootstrap';

export function MultiCheckbox({
  name,
  value,
  onChange,
  options,
  type = 'checkbox',
  handleBlur
}) {
  const isChecked = (item) => value?.includes(item);

  /**
   * Handles on change events
   */
  const handleChange = (arrayHelpers, item) => {
    return ($e) => {
      if ($e.target.checked) {
        arrayHelpers.push(item);
      } else {
        const index = value.indexOf(item);

        if (index >= 0) {
          arrayHelpers.remove(index);
        }
      }
    };
  };
  return (
    <FieldArray
      name={name}
      render={(arrayHelpers) =>
        options?.map((option, index) => {
          const label = option && option.label ? option.label : option;
          const _value = option && option.value ? option.value : option;

          return (
            <Form.Check
              key={index}
              type={type || 'checkbox'}
              label={label}
              defaultChecked={isChecked(_value)}
              onChange={handleChange(arrayHelpers, _value)}
              onBlur={handleBlur}
            />
          );
        })
      }
    />
  );
}

export default MultiCheckbox;
