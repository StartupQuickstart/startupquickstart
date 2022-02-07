import React from 'react';
import { Search } from 'react-feather';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Tooltip } from '@/components/common';

export function ViewRecordButton({
  onClose,
  link,
  className,
  singularLabel = 'Record',
  recordType,
  parent,
  record,
  label,
  asText = false,
  iconOnly = false,
  mode
}) {
  label = label || `View ${singularLabel}`;

  return (
    <Tooltip tooltip={iconOnly && label}>
      <Link
        to={`/${recordType}/${record.id}`}
        className={classNames(
          asText ? 'btn-text' : 'btn btn-primary',
          className
        )}
      >
        <Search /> {!iconOnly && label}
      </Link>
    </Tooltip>
  );
}

export default ViewRecordButton;
