import React from 'react';
import { CheckCircle, XCircle } from 'react-feather';

export default class PasswordRequirements extends React.Component {
  render() {
    const errors = this.props.errors || [];

    return (
      <div className="password-requirements">
        <label>Password Requirements</label>
        <ul>
          <li>
            {this.props.value && !errors.includes('length') ? (
              <CheckCircle size="13" className="text-success" />
            ) : (
              <XCircle size="13" className="text-danger" />
            )}
            Must be a minimum of 8 characters.
          </li>
          <li>
            {this.props.value &&
            !(
              errors.includes('letters') ||
              errors.includes('number') ||
              errors.includes('special')
            ) ? (
              <CheckCircle size="13" className="text-success" />
            ) : (
              <XCircle size="13" className="text-danger" />
            )}
            Must contain letters, numbers, and symbols.
          </li>
          <li>
            {this.props.value && !errors.includes('match') ? (
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
}
