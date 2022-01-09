import React from 'react';
import { Link } from 'react-router-dom';
import { Input } from './Input';

export function PasswordInput(props) {
  return <Input {...props} />;
}

PasswordInput.defaultProps = {
  id: 'password',
  label: 'Password',
  placeholder: '**********',
  type: 'password',
  helpText: (
    <>
      Forgot password? <Link to="/forgot-password">Click here</Link> to reset
      it.
    </>
  )
};
