import { FieldArray } from 'formik';
import _ from 'lodash';
import { Form } from 'react-bootstrap';

export function LineSeperatedInput({
  name,
  value,
  label,
  onChange,
  options,
  handleBlur
}) {
  /**
   * Handles on change events
   */
  const handleChange = ($e) => {
    const newValue = $e.target.value.split('\n');
    onChange(newValue);
  };

  return (
    <FieldArray
      name={name}
      render={(arrayHelpers) => (
        <>
          <Form.Control
            name={name}
            value={value?.join('\n')}
            as="textarea"
            rows="3"
            placeholder="Line separated values"
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <span className="form-text">
            Add each new {label || 'item'} on a new line.
          </span>
        </>
      )}
    />
  );
}

export default LineSeperatedInput;
