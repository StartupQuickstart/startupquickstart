import React from 'react';
import classnames from 'classnames';
import Breadcrumbs from './Breadcrumbs';
import * as Feather from 'react-feather';

export function PageHeader({
  icon,
  iconColor,
  as,
  hasMargin,
  title,
  subTitle,
  status,
  breadcrumbs,
  className,
  avatar
}) {
  const Hx = as || 'h3';
  const Icon = Feather[icon];

  return (
    <div
      className={classnames('row ', hasMargin ? 'mb-2 mb-xl-3' : '', className)}
    >
      <div className="col-12 col-sm-auto order-2 order-md-1">
        <Hx className="fw-light">
          {Icon && (
            <Icon className={`me-3 text-${iconColor || 'primary'}`} size="40" />
          )}
          {avatar && (
            <img
              alt={'Avatar'}
              src={avatar}
              className="rounded-circle me-3"
              style={{ width: '40px' }}
            />
          )}
          <strong>{title}</strong> {subTitle}
        </Hx>
        {status && <div>{status}</div>}
      </div>

      <Breadcrumbs items={breadcrumbs} />
    </div>
  );
}

PageHeader.defaultProps = {
  hasMargin: true
};

export default PageHeader;
