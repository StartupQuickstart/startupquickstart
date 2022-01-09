import React from 'react';
import { Input } from './Input';

export function EmailInput(props) {
  return <Input {...props} />;
}

EmailInput.defaultProps = {
  id: 'email',
  label: 'Email',
  type: 'email',
  placeholder: 'first.last@example.com'
};
