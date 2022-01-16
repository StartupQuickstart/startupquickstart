import classNames from 'classnames';

export function Button({ children, variant = 'primary', className, ...props }) {
  <button className={classNames(`btn btn-${variant}`, className)} {...props}>
    {children}
  </button>;
}

export default Button;
