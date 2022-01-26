import React from 'react';
import { Image } from '.';
import config from '@/config';

export default function logo() {
  return (
    <Image
      src={config.app.logo.src}
      width={config.app.logo.width}
      height={config.app.logo.height}
      alt="logo"
    />
  );
}
