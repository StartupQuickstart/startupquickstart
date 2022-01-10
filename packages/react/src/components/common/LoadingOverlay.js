import React from 'react';
import Loading from './Loading';
import classnames from 'classnames';

export function LoadingOverlay({ className }) {
  return (
    <div className={classnames('loading-overlay', className)}>
      <Loading />
    </div>
  );
}

export default LoadingOverlay;
