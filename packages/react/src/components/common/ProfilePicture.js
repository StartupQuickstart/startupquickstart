import React from 'react';

export function ProfilePicture({ image, name, className }) {
  if (image) {
    return <img src={image} alt={name} className={className} />;
  } else {
    const initials = name
      .split(' ')
      .map((i) => i[0])
      .join('');

    return (
      <svg height="360" width="360" className={className}>
        <rect fill="#6c757d" x="0" y="0" height="360" width="360"></rect>
        <text
          fill="#ffffff"
          font-size="40"
          text-anchor="middle"
          x="50%"
          y="60%"
        >
          {initials}
        </text>
      </svg>
    );
  }
}

export default ProfilePicture;
