import React from 'react';
import { useConfig } from 'context/providers';

export function SupportEmail(props) {
  const { config } = useConfig();
  return <a href={`mailto:${config?.supportEmail}`}>{config?.supportEmail}</a>;
}

export default SupportEmail;
