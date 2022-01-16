import React, { useRef, useState } from 'react';
import classnames from 'classnames';
import { MoreHorizontal } from 'react-feather';
import { useOutsideAlerter } from '@/effects';

export function CardActions({ actions, onClick }) {
  const ref = useRef(null);
  const [open, setOpen] = useState();

  useOutsideAlerter(ref, () => setOpen(false));

  /**
   * Toggles the actions open/closed
   */
  function toggle() {
    setOpen(!open);
  }

  /**
   * Handles on click events
   *
   * @param {Object} Action to call on click for
   */
  function handleClick(action) {
    setOpen(false);
    onClick && onClick(action);
  }

  if (!actions || !actions.length) {
    return '';
  }

  return (
    <div className="card-actions float-end" ref={ref}>
      <div className="dropdown show">
        <span
          onClick={toggle}
          className={classnames('clickable', open ? 'show' : '')}
        >
          <MoreHorizontal />
        </span>

        <div
          className={classnames(
            'dropdown-menu dropdown-menu-end',
            open ? 'show' : ''
          )}
        >
          {actions.map((action, index) => {
            return (
              <span
                key={index}
                className="dropdown-item clickable"
                onClick={() => handleClick(action)}
              >
                {action.name}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CardActions;
