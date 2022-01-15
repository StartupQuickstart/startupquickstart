import React from 'react';
import { FieldArray } from 'formik';
import { Form } from 'react-bootstrap';

export class MultiCheckbox extends React.Component {
  isChecked = (value) => this.props.value && this.props.value.includes(value);

  /**
   * Handles on change events
   */
  onChange = (arrayHelpers, value) => {
    return ($e) => {
      if ($e.target.checked) {
        arrayHelpers.push(value);
      } else {
        const index = this.props.value.indexOf(value);

        if (index >= 0) {
          arrayHelpers.remove(index);
        }
      }

      const index = this.props.value ? this.props.value.indexOf('') : null;
      if (index >= 0) {
        arrayHelpers.remove(index);
      }
    };
  };

  render() {
    const options = this.props.options || [];

    return (
      <FieldArray
        name={this.props.name}
        render={(arrayHelpers) =>
          options.map((option, index) => {
            const label = option && option.label ? option.label : option;
            const value = option && option.value ? option.value : option;

            return (
              <Form.Check
                key={index}
                type={'checkbox'}
                label={label}
                defaultChecked={this.isChecked(value)}
                onChange={this.onChange(arrayHelpers, value)}
                onBlur={this.props.handleBlur}
              />
            );
          })
        }
      />
    );
  }
}

export default MultiCheckbox;
