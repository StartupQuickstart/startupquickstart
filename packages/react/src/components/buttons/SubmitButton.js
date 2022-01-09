import classNames from 'classnames';
import { ArrowRight } from 'react-feather';

export function SubmitButton({
  isSubmitting,
  errors,
  label,
  showArrow,
  variant,
  className,
  ...props
}) {
  return (
    <button
      type="submit"
      className={classNames(`btn btn-lg btn-${variant}`, className)}
      disabled={isSubmitting || Object.keys(errors).length}
      {...props}
    >
      {label} {showArrow && <ArrowRight />}
    </button>
  );
}

SubmitButton.defaultProps = {
  showArrow: true,
  variant: 'primary',
  errors: {}
};
