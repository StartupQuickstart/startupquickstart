import React from 'react';
import Loading from './Loading';
import classnames from 'classnames';

export default function LoadingOverlay({ className }) {
  return (
    <div className={classnames('loading-overlay', className)}>
      <Loading />
    </div>
  );
}
