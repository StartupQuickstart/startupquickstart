import React from 'react';

export default function Logo({
  src = require('../../assets/images/logo.png'),
  alt = 'StartupQuickstart',
  ...props
}) {
  return <img src={src} alt={alt} {...props} />;
}
