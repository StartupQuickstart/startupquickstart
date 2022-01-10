import React, { Fragment } from 'react';
import classNames from 'classnames';
import * as Feather from 'react-feather';
import { Link } from 'react-router-dom';
import SidebarCallToAction from './SidebarCallToAction';
import { useNavigation } from '../../../context/providers';
import Logo from '../Logo';

export default function Sidebar() {
  const {
    sidebarItems,
    sidebarCollapsed,
    toggleSidebar,
    toggleSidebarItem,
    callToAction
  } = useNavigation();

  /**
   * Toggles the sidebar on mobile devices
   */
  function toggleSidebarOnMobile() {
    if (window.innerWidth < 992) {
      toggleSidebar();
    }
  }

  return (
    <nav
      id="sidebar"
      className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}
    >
      <div className="sidebar-content js-simplebar">
        <a className="sidebar-brand text-center" href="/">
          <Logo />
        </a>

        <ul className="sidebar-nav">
          {sidebarItems.map((group, groupIndex) => {
            const groupKey = `group_${groupIndex}`;

            return (
              <Fragment key={groupKey}>
                {group.name && <li className="sidebar-header">{group.name}</li>}
                {group.items.map((item, itemIndex) => {
                  const itemKey = `${groupKey}_item_${itemIndex}`;
                  const className = classNames(
                    'sidebar-link',
                    item.className,
                    item.items &&
                      (item.collapsed || item.collapsed === undefined)
                      ? 'collapsed'
                      : ''
                  );

                  const Icon = Feather[item.icon];

                  return (
                    <li
                      key={itemKey}
                      className={`sidebar-item ${item.className} ${
                        window.location.pathname.indexOf(item.to) === 0
                          ? 'active'
                          : ''
                      }`}
                    >
                      {!item.items && (
                        <Link
                          className={className}
                          to={item.to}
                          onClick={toggleSidebarOnMobile}
                        >
                          {item.icon && (
                            <>
                              <Icon className="align-middle feather" />{' '}
                            </>
                          )}
                          <span className="align-middle">{item.name}</span>
                          {item.badge && (
                            <span
                              className={`sidebar-badge badge bg-${item.badge.variant}`}
                            >
                              {item.badge.name}
                            </span>
                          )}
                        </Link>
                      )}
                      {item.items && (
                        <span
                          data-toggle="collapse"
                          className={className}
                          onClick={() =>
                            toggleSidebarItem(groupIndex, itemIndex)
                          }
                        >
                          {item.icon && (
                            <>
                              <Icon className="align-middle feather" />{' '}
                            </>
                          )}
                          <span className="align-middle">{item.name}</span>
                          {item.badge && (
                            <span
                              className={`sidebar-badge badge bg-${item.badge.variant}`}
                            >
                              {item.badge.name}
                            </span>
                          )}
                        </span>
                      )}
                      {item.items && (
                        <ul
                          id="auth"
                          className={`sidebar-dropdown list-unstyled ${
                            item.collapsed || item.collapsed === undefined
                              ? 'collapse'
                              : ''
                          }`}
                          data-parent="#sidebar"
                        >
                          {item.items.map((item, index) => {
                            return (
                              <li
                                key={`${itemKey}_${index}`}
                                className={`sidebar-item ${item.className}`}
                              >
                                <Link
                                  className="sidebar-link"
                                  to={item.to}
                                  onClick={toggleSidebarOnMobile}
                                >
                                  {item.name}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </Fragment>
            );
          })}
        </ul>

        {callToAction && <SidebarCallToAction {...callToAction} />}
      </div>
    </nav>
  );
}
