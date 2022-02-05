import classNames from 'classnames';
import Flatpickr from 'react-flatpickr';
import React from 'react';
import 'flatpickr/dist/themes/airbnb.css';

export function DateInput({
  onChange,
  value,
  className,
  showTime,
  dateFormat,
  ...props
}) {
  if (!dateFormat) {
    dateFormat = 'm/d/Y';

    if (showTime) {
      dateFormat = `${dateFormat} h:mK`;
    }
  }

  return (
    <Flatpickr
      data-enable-time={showTime}
      data-date-format={dateFormat}
      className={classNames('form-control', className)}
      value={value}
      onChange={([date]) => {
        this.setState({ date });
      }}
      {...props}
    />
  );
}

export default DateInput;
