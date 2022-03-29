import React from 'react';
import classNames from 'classnames';
import { ArrowRight } from 'react-feather';

export function SubmitButton({
  disabled,
  label,
  showArrow = true,
  variant = 'primary',
  className,
  ...props
}) {
  return (
    <button
      type="submit"
      className={classNames(`btn btn-lg btn-${variant}`, className)}
      disabled={disabled}
      {...props}
    >
      {label} {showArrow && <ArrowRight />}
    </button>
  );
}
