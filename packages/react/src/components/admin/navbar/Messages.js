import React from 'react';
import Avatar from 'react-avatar';
import { MessageSquare } from 'react-feather';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import { useMessage } from 'context/providers';

/**
 * Sample Message:
 *
 * {
 *    date: new Date(),
 *    from: {
 *      name: 'Thomas Boles',
 *      profile_picture: 'https://example.com/image.png'
 *    },
 *    message: 'My first message'
 * }
 *
 */
export default function Messages({ toggleItem, toggledItem }) {
  const now = new Date();
  const { messages } = useMessage();

  return (
    <li
      className="nav-item dropdown clickable mx-2"
      onClick={() => toggleItem('messages')}
    >
      <span
        className="nav-icon dropdown-toggle"
        id="messagesDropdown"
        data-toggle="dropdown"
      >
        <div className="position-relative">
          <MessageSquare className="align-middle feather" />
          <span className="indicator">{messages.length}</span>
        </div>
      </span>
      <div
        className={`dropdown-menu dropdown-menu-lg dropdown-menu-end py-0 ${
          toggledItem === 'messages' ? 'show' : ''
        }`}
        aria-labelledby="messagesDropdown"
      >
        <div className="dropdown-menu-header">
          <div className="position-relative">
            {messages.length} New Messages
          </div>
        </div>
        <div className="list-group">
          {messages.map((message, index) => {
            const minutes = (now - message.date) / 1000 / 60;
            let unit = 'minutes';

            if (minutes >= 24 * 60) {
              unit = 'days';
            } else if (minutes >= 60) {
              unit = 'hours';
            }

            return (
              <span key={`message_${index}`} className="list-group-item">
                <div className="row g-0 align-items-center">
                  <div className="col-2">
                    <span className="avatar me-2">
                      <Avatar
                        src={message.from?.profile_picture}
                        name={message.from?.name}
                        className="img-fluid rounded-circle"
                        size="40"
                      />
                    </span>
                  </div>
                  <div className="col-10 ps-2">
                    <div className="text-dark">{message.from?.name}</div>
                    <div className="text-muted small mt-1">
                      {message.message}
                    </div>
                    <div className="text-muted small mt-1">
                      <Moment diff={message.date} unit={unit}>
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
          <Link to="/messages" className="text-muted">
            Show all messages
          </Link>
        </div>
      </div>
    </li>
  );
}
