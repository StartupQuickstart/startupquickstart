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
      dateFormat = `${dateFormat} h:iK`;
    }
  }

  return (
    <Flatpickr
      data-enable-time={showTime}
      data-date-format={dateFormat}
      className={classNames('form-control', className)}
      value={value}
      data-minute-increment={1}
      onChange={([date]) => {
        this.setState({ date });
      }}
      {...props}
    />
  );
}

export default DateInput;
