import React, { Fragment } from 'react';
import classNames from 'classnames';
import * as Feather from 'react-feather';
import { Link } from 'react-router-dom';
import SidebarCallToAction from './SidebarCallToAction';
import { useConfig, useNavigation, useAuth } from '@/context/providers';
import Logo from '@/components/admin/Logo';

export default function Sidebar() {
  const { sidebarItems, sidebarCollapsed, toggleSidebar, toggleSidebarItem } =
    useNavigation();
  const { user } = useAuth();
  const { callToAction, config } = useConfig();
  const { hasSubscriptions } = config || {};

  /**
   * Toggles the sidebar on mobile devices
   */
  function toggleSidebarOnMobile() {
    if (window.innerWidth < 992) {
      toggleSidebar();
    }
  }

  function canView(item) {
    return item.canView ? item.canView(user) : true;
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
          {sidebarItems?.map((group, groupIndex) => {
            const groupKey = `group_${groupIndex}`;

            if (!canView(group)) {
              return '';
            }

            return (
              <Fragment key={groupKey}>
                {group.name && <li className="sidebar-header">{group.name}</li>}
                {group.items.map((item, itemIndex) => {
                  if (!canView(item)) {
                    return '';
                  }

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
                        window.location.pathname.endsWith(item.to)
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
                            if (!canView(item)) {
                              return '';
                            }

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
          {hasSubscriptions && (
            <>
              <li className="sidebar-header">Account</li>
              <Link className={'sidebar-link d-block'} to={'/billing'}>
                <Feather.DollarSign className="align-middle feather" />
                <span className="align-middle">Billing</span>
              </Link>
            </>
          )}
          <Link className={'sidebar-link d-block d-md-none'} to={'/logout'}>
            <Feather.LogOut className="align-middle feather" />
            <span className="align-middle">Logout</span>
          </Link>
        </ul>

        {callToAction && <SidebarCallToAction {...callToAction} />}
      </div>
    </nav>
  );
}
