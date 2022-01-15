import React from 'react';
import classNames from 'classnames';
import UserIcon from './UserIcon';
import * as Feather from 'react-feather';
import { Link } from 'react-router-dom';
import { useNavigation } from 'context/providers';

export default function UserOptions({ toggleItem, toggledItem }) {
  const { userOptions } = useNavigation();

  const showDropdown = userOptions && userOptions.length > 0;

  return (
    <li
      className="nav-item dropdown clickable mx-2"
      onClick={() => toggleItem('userOptions')}
    >
      <span
        className={classNames(
          'nav-link d-none d-sm-inline-block p-0',
          showDropdown && 'dropdown-toggle'
        )}
        data-toggle="dropdown"
      >
        <UserIcon />
      </span>
      {showDropdown && (
        <div
          className={`dropdown-menu dropdown-menu-end ${
            toggledItem === 'userOptions' ? 'show' : ''
          }`}
        >
          {userOptions.map((option, index) => {
            if (!option.name) {
              return (
                <div key={`option_${index}`} className="dropdown-divider"></div>
              );
            }

            const Icon = Feather[option.icon];

            return (
              <Link
                key={`option_${index}`}
                className="dropdown-item"
                to={option.to}
              >
                {option.icon && <Icon className="feather align-middle me-2" />}
                {option.name}
              </Link>
            );
          })}
        </div>
      )}
    </li>
  );
}
