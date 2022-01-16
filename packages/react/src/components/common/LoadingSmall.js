import React from 'react';
import classNames from 'classnames';

export function LoadingSmall({ size, className }) {
  return (
    <div
      className={classNames('spinner-border text-primary', className)}
      style={{ width: size + 'px', height: size + 'px' }}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

LoadingSmall.defaultProps = {
  size: 20
};

export default LoadingSmall;
