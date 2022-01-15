import React from 'react';
import Avatar from 'react-avatar';
import { useAuth } from 'context/providers';

export default function UserIcon() {
  const { user } = useAuth();

  if (!user) {
    return '';
  }

  return (
    <>
      <span className="avatar me-2">
        {user.profile_picture ? (
          <img
            src={user.profile_picture}
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
