import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';

export function Breadcrumbs(props) {
  const items = props.items || [];

  return (
    <div className="col-auto mb-2 mb-md-0 ms-md-auto text-left text-md-right mt-n1 order-1 order-md-2">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb bg-transparent p-0 mt-1 mb-0">
          {items.map((item, index) => (
            <li
              key={index}
              className={classNames('breadcrumb-item', item.className)}
            >
              {item.to && <Link to={item.to}>{item.name}</Link>}
              {!item.to && <span>{item.name}</span>}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}

export default Breadcrumbs;
