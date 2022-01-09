import React, { useState, useRef } from 'react';
import Notifications from './Notifications';
import Messages from './Messages';
import UserOptions from './UserOptions';
import useOutsideAlerter from '../../effects/useOutsideAlerter';
import { useConfig, useNavigation } from '../../../context/providers';

export default function Navbar() {
  const ref = useRef(null);
  const [toggledItem, setToggledItem] = useState(null);
  const { toggleSidebar } = useNavigation();
  const { features } = useConfig();

  useOutsideAlerter(ref, () => setToggledItem(null));

  function toggleItem(newItem) {
    setToggledItem(newItem === toggledItem ? null : newItem);
  }

  return (
    <nav className="navbar navbar-expand navbar-light navbar-bg">
      <span className="sidebar-toggle d-flex clickable" onClick={toggleSidebar}>
        <i className="hamburger align-self-center"></i>
      </span>

      {/* <NavbarSearch /> */}

      <div className={`navbar-collapse collapse`}>
        <ul className="navbar-nav navbar-align" ref={ref}>
          {features.notifications && (
            <Notifications toggleItem={toggleItem} toggledItem={toggledItem} />
          )}
          {features.messages && (
            <Messages toggleItem={toggleItem} toggledItem={toggledItem} />
          )}
          <UserOptions toggleItem={toggleItem} toggledItem={toggledItem} />
        </ul>
      </div>
    </nav>
  );
}
