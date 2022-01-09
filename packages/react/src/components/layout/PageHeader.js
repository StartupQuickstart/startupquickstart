import React from 'react';
import classnames from 'classnames';
import Breadcrumbs from './Breadcrumbs';

export default function PageHeader(props) {
  const Hx = props.as || 'h3';
  const hasMargin = props.hasMargin !== false;

  return (
    <div
      className={classnames(
        'row ',
        hasMargin ? 'mb-2 mb-xl-3' : '',
        props.className
      )}
    >
      <div className="col-12 col-sm-auto order-2 order-md-1">
        <Hx className="fw-light">
          <strong>{props.title}</strong> {props.subTitle}
        </Hx>
        {props.status && <div>{props.status}</div>}
      </div>

      <Breadcrumbs items={props.breadcrumbs} />
    </div>
  );
}
