import React from 'react';

export function Logo({
  src = require('../../assets/images/logo.png'),
  alt = 'StartupQuickstart',
  ...props
}) {
  return <img src={src} alt={alt} {...props} />;
}

export default Logo;
