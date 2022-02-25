import React from 'react';

export function MissingRecords({
  title,
  description,
  className,
  variant = 'black',
  style = {}
}) {
  style = Object.assign(
    {
      maxWidth: '500px',
      width: '90%',
      margin: 'auto'
    },
    style
  );

  const classNames = className ? className.split(' ') : [];

  if (
    !className ||
    (className.indexOf('py-') === -1 && className.indexOf('p-') === -1)
  ) {
    classNames.push('py-3');
  }

  return (
    <div className={classNames.join(' ')} style={style}>
      <div className="text-center">
        <h3 className={`text-${variant}`}>{title}</h3>
        <p className="lead">{description}</p>
      </div>
    </div>
  );
}

export default MissingRecords;
