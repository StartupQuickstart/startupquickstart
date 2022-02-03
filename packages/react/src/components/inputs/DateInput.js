import classNames from 'classnames';
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export function DateInput({ onChange, value, className, ...props }) {
  return (
    <DatePicker
      className={classNames('form-control', className)}
      selected={value || new Date()}
      onChange={onChange}
      onSelect={onChange}
      {...props}
    />
  );
}

export default DateInput;
