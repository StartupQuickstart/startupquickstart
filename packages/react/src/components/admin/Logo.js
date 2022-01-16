import React from 'react';
import { useConfig } from '@/context/providers';

export function Logo(props) {
  const { config } = useConfig();
  const logo = config?.logo || {};
  return <img src={logo?.src} alt={logo?.alt} {...logo} {...props} />;
}

export default Logo;
