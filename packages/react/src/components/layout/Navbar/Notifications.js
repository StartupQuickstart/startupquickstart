import { useContext } from 'react';
import { Bell } from 'react-feather';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import { GlobalContext } from '../../../context/global/provider';

export default function Notifications({ toggleItem, toggledItem }) {
  const now = new Date();
  const { notifications } = useContext(GlobalContext);

  return (
    <li
      className="nav-item dropdown clickable mr-1"
      onClick={() => toggleItem('notifications')}
    >
      <span
        className="nav-icon dropdown-toggle"
        id="alertsDropdown"
        data-toggle="dropdown"
      >
        <div className="position-relative">
          <Bell className="align-middle feather" />
          <span className="indicator">{notifications.length}</span>
        </div>
      </span>
      <div
        className={`dropdown-menu dropdown-menu-lg dropdown-menu-end py-0 ${
          toggledItem === 'notifications' ? 'show' : ''
        }`}
        aria-labelledby="alertsDropdown"
      >
        <div className="dropdown-menu-header">
          {notifications.length} New Notifications
        </div>
        <div className="list-group">
          {notifications.map((notification, index) => {
            const minutes = (now - notification.date) / 1000 / 60;
            let unit = 'minutes';

            if (minutes >= 24 * 60) {
              unit = 'days';
            } else if (minutes >= 60) {
              unit = 'hours';
            }

            const Icon = notification.icon || Bell;

            return (
              <span key={`notification_${index}`} className="list-group-item">
                <div className="row g-0 align-items-center">
                  <div className="col-2">
                    <Icon
                      className={`feather text-${
                        notification.iconVariant || 'primary'
                      }`}
                    />
                  </div>
                  <div className="col-10">
                    <div className="text-dark">{notification.name}</div>
                    <div className="text-muted small mt-1">
                      {notification.description}
                    </div>
                    <div className="text-muted small mt-1">
                      <Moment diff={notification.date} unit={unit}>
                        {now}
                      </Moment>
                      {unit[0]} ago
                    </div>
                  </div>
                </div>
              </span>
            );
          })}
        </div>
        <div className="dropdown-menu-footer">
          <Link to="/notifications" className="text-muted">
            Show all notifications
          </Link>
        </div>
      </div>
    </li>
  );
}
