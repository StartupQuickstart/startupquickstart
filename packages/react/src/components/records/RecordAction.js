import React from 'react';
import classNames from 'classnames';
import { Tooltip } from '@/components/common';

export function RecordAction({
  onClick,
  className,
  tooltip,
  children,
  asText = false
}) {
  return (
    <Tooltip tooltip={tooltip}>
      <span
        onClick={onClick}
        className={classNames(
          asText ? 'btn-text' : 'btn btn-primary',
          'mx-1',
          className
        )}
      >
        {children}
      </span>
    </Tooltip>
  );
}

export default RecordAction;
