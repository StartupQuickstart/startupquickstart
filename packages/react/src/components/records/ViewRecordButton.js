import React from 'react';
import { Search } from 'react-feather';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

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
  label = iconOnly ? '' : label || `View ${singularLabel}`;

  return (
    <Link
      to={`/${recordType}/${record.id}`}
      className={classNames(asText ? 'btn-text' : 'btn btn-primary', className)}
    >
      <Search /> {label}
    </Link>
  );
}

export default ViewRecordButton;
