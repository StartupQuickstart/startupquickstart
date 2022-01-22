import React from 'react';
import { Image } from '.';
import Config from '@/config';

export default function logo() {
  return (
    <Image
      src={Config.logo.url}
      width={Config.logo.width}
      height={Config.logo.height}
      alt="logo"
    />
  );
}
