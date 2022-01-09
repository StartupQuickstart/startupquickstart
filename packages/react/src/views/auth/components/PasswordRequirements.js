import React from 'react';
import { CheckCircle, XCircle } from 'react-feather';

export function PasswordRequirements({ errors, value }) {
  return (
    <div className="password-requirements">
      <label>Password Requirements</label>
      <ul>
        <li>
          {value && !errors?.includes('length') ? (
            <CheckCircle size="13" className="text-success" />
          ) : (
            <XCircle size="13" className="text-danger" />
          )}
          Must be a minimum of 8 characters.
        </li>
        <li>
          {value &&
          !(
            errors?.includes('letters') ||
            errors?.includes('number') ||
            errors?.includes('special')
          ) ? (
            <CheckCircle size="13" className="text-success" />
          ) : (
            <XCircle size="13" className="text-danger" />
          )}
          Must contain letters, numbers, and symbols.
        </li>
        <li>
          {value && !errors?.includes('match') ? (
            <CheckCircle size="13" className="text-success" />
          ) : (
            <XCircle size="13" className="text-danger" />
          )}
          Passwords must match.
        </li>
      </ul>
    </div>
  );
}
