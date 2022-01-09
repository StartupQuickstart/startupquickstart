import React from 'react';
import { Form } from 'react-bootstrap';

export function Input({
  id,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  touched,
  errors,
  disabled,
  className,
  required,
  size,
  helpText,
  type,
  showErrors,
  ...props
}) {
  return (
    <div className="form-group">
      <label className="form-label">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <Form.Control
        id={id}
        className={`form-control-${size}`}
        placeholder={placeholder}
        value={value || ''}
        type={type}
        onChange={onChange}
        onBlur={onBlur}
        isInvalid={touched[id] && errors[id]}
        disabled={disabled}
        required={required}
        {...props}
      />
      {showErrors && (
        <Form.Control.Feedback type="invalid">
          {errors[id]}
        </Form.Control.Feedback>
      )}
      {helpText && <small>{helpText}</small>}
    </div>
  );
}

Input.defaultProps = {
  id: Date.now(),
  label: 'Text Input',
  placeholder: 'Text Input',
  type: 'text',
  size: 'md',
  showErrors: true
};
