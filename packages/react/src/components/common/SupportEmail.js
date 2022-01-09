import React from 'react';
import { useConfig } from '../../context/providers';

export default function SupportEmail(props) {
  const { config } = useConfig();
  return <a href={`mailto:${config?.supportEmail}`}>{config?.supportEmail}</a>;
}
