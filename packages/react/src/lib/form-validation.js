export class FormValidation {
  /**
   * Gets the value for the dot notation prop from 'the values.
   * Example: 'test.prop' would return 1 from {test: {prop: 1}}
   *
   * @param {String} prop Dot notated prop
   * @param {Object} values Values object to get value form
   */
  static getValue(prop, values) {
    const parts = prop.split('.');
    return parts.reduce((o, i, index) => {
      return index === parts.length - 1 ? o[i] : o[i] || {};
    }, values);
  }

  /**
   * Gets the message allowing for a function to be called in to handle the value
   *
   * @param {String|Function} message Message to handle
   * @param {String} value Value to use in message
   * @param {String} defaultMessage Message to use if one doesn't exist
   */
  static getMessage(message, value, defaultMessage) {
    if (message && typeof message === 'function') {
      return message(value);
    }

    return message || defaultMessage;
  }

  /**
   * Sets the error using a dot notated string
   *
   * @param {String} prop Dot notated prop
   * @param {Object} errors Errors object to set the error in
   * @param {String} error Error to set
   */
  static setError(prop, errors, error) {
    const parts = prop.split('.');
    let obj = errors;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (i === parts.length - 1) {
        obj[part] = error;
      } else {
        obj[part] = obj[part] || {};
        obj = obj[part];
      }
    }
  }

  /**
   * Validates domain names
   *
   * @param {String} prop Dot notated string to get values and set errors
   * @param {Object} values Values object to get the value from
   * @param {Object} errors Errors object ot set the error in
   * @param {String|Function} message Error message to set
   */
  static validateDomain(prop, values, errors, message) {
    const value = this.getValue(prop, values);
    const domainRegex = new RegExp(
      /^(([a-z0-9|-]+\.)*[a-z0-9|-]+\.[a-z]+)|(localhost:[0-9]{4})$/
    );
    if (!domainRegex.test(value)) {
      const error = this.getMessage(
        message,
        value,
        `${value} is not a valid domain name.`
      );
      this.setError(prop, errors, error);
    }
  }

  /**
   * Validates comma seperated email addresses
   *
   * @param {String} prop Dot notated string to get values and set errors
   * @param {Object} values Values object to get the value from
   * @param {Object} errors Errors object ot set the error in
   * @param {String|Function} message Error message to set
   */
  static validateCommaSeperatedEmails(prop, values, errors, message) {
    const emailRegex = new RegExp(
      /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
    );
    const emails = (this.getValue(prop, values) || '')
      .replace(/\s/g, '')
      .split(',');
    const emailErrors = emails
      .map((email, index) => {
        if (email && email.length && !emailRegex.test(email)) {
          return (
            <div key={index}>
              {this.getMessage(message, email, `${email} is not a valid email`)}
            </div>
          );
        }

        return null;
      })
      .filter((error) => error);

    if (emailErrors && emailErrors.length) {
      this.setError(prop, errors, emailErrors);
    }
  }

  /**
   * Validates hex colors
   *
   * @param {String} prop Dot notated string to get values and set errors
   * @param {Object} values Values object to get the value from
   * @param {Object} errors Errors object ot set the error in
   * @param {String|Function} message Error message to set
   */
  static validateColor(prop, values, errors, message) {
    const value = this.getValue(prop, values);

    const colorRegex = new RegExp(/^#[a-fA-F0-9]{3}$/);
    const colorRegex2 = new RegExp(/^#[a-fA-F0-9]{6}$/);
    if (
      value &&
      value.length &&
      !colorRegex.test(value) &&
      !colorRegex2.test(value)
    ) {
      const error = this.getMessage(
        message,
        value,
        `${value} is not a valid hex color.`
      );
      this.setError(prop, errors, error);
    }
  }

  /**
   * Validates an email address
   *
   * @param {String} prop Dot notated string to get values and set errors
   * @param {Object} values Values object to get the value from
   * @param {Object} errors Errors object ot set the error in
   * @param {String|Function} message Error message to set
   */
  static validateEmail(prop, values, errors, message) {
    const value = this.getValue(prop, values);

    const isValidEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
      value
    );

    if (value && !isValidEmail) {
      const error = this.getMessage(
        message,
        value,
        `${value} is not a valid email address.`
      );
      this.setError(prop, errors, error);
    }
  }

  /**
   * Validates an password
   *
   * @param {String} prop Dot notated string to get values and set errors
   * @param {Object} values Values object to get the value from
   * @param {Object} errors Errors object ot set the error in
   */
  static validatePassword(prop, values, errors) {
    const value = this.getValue(prop, values) || '';
    const confirmation = this.getValue(prop + '_confirmation', values, errors);
    let issues = [];

    if (!/[a-zA-Z]/g.test(value)) {
      issues.push('letters');
    }

    if (!/[0-9]/g.test(value)) {
      issues.push('number');
    }

    if (!/[*.!@$%^&(){}[\]:;<>,.?/~_/-=|]/g.test(value)) {
      issues.push('special');
    }

    if (value.length < 8) {
      issues.push('length');
    }

    if (!value || !value.trim().length || value !== confirmation) {
      issues.push('match');
    }

    if (issues.length) {
      this.setError(prop, errors, issues.join(','));
    }
  }

  /**
   * Validates required fields
   *
   * @param {String} prop Dot notated string to get values and set errors
   * @param {Object} values Values object to get the value from
   * @param {Object} errors Errors object ot set the error in
   * @param {String|Function} message Error message to set
   */
  static validateRequired(prop, values, errors, message) {
    let value = this.getValue(prop, values);

    if (typeof value === 'string') {
      value = value.trim();
    }

    if (!value || (typeof value === 'string' && !value.length)) {
      const error = this.getMessage(message, value, `Required field.`);
      this.setError(prop, errors, error);
    }
  }
}

export default FormValidation;
