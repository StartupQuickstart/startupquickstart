import React from 'react';
import Avatar from 'react-avatar';
import { useAuth0 } from '@auth0/auth0-react';

export default function UserIcon() {
  const { user } = useAuth0();

  if (!user) {
    return '';
  }

  return (
    <>
      <span className="avatar me-2">
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.name}
            referrerPolicy="no-referrer"
            width="40"
            height="40"
            className="img-fluid rounded"
          />
        ) : (
          <Avatar name={user.name} className="img-fluid rounded" size="40" />
        )}
      </span>
      <span className="text-dark">{user.name}</span>
    </>
  );
}
