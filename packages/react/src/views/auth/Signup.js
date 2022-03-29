import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import { Form } from 'react-bootstrap';
import FormValidation from '../../lib/form-validation';
import { useAuth, useConfig } from '@/context/providers';
import AuthWrapper from '@/components/auth/AuthWrapper';
import { EmailInput, PasswordInput, TextInput } from '@/components/inputs';
import { SubmitButton } from '@/components/buttons';
import { PasswordRequirements } from '@/components/auth/PasswordRequirements';

export function Signup() {
  const { signup } = useAuth();
  const { config } = useConfig();
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  /**
   *  Saves the form
   *
   * @param {Object} values Form values
   * @param {Object} props Misc properties
   */
  async function submit(values, props) {
    setSubmitting(true);
    setError(null);

    try {
      await signup(values);
    } catch (err) {
      setError(err?.response?.data?.message || 'Unknown Error');
      throw err;
    } finally {
      props.setSubmitting(false);
      setSubmitting(false);
    }
  }

  /**
   * Validates the from
   *
   * @param {Object} values Form values
   * @param {Object} props Misc properties
   */
  function validate(values, props) {
    const errors = {};
    FormValidation.validateRequired('first_name', values, errors);
    FormValidation.validateRequired('last_name', values, errors);
    FormValidation.validateEmail('email', values, errors);
    FormValidation.validateRequired('email', values, errors);
    FormValidation.validateRequired('password', values, errors);
    FormValidation.validateRequired('password_confirmation', values, errors);

    FormValidation.validatePassword('password', values, errors);
    return errors;
  }

  return (
    <AuthWrapper
      heading={config?.signup?.heading}
      subheading={config?.signup?.subheading}
      title={'Enter your details'}
      isSubmitting={isSubmitting}
      setupProgress={{ active: 'signup', completed: [] }}
    >
      <Formik initialValues={{}} onSubmit={submit} validate={validate}>
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          isValid,
          isDirty
        }) => (
          <Form noValidate onSubmit={handleSubmit} autoComplete="off">
            {error && <div className="alert alert-danger">{error}</div>}
            <TextInput
              id="first_name"
              placeholder="First Name"
              label="First Name"
              value={values.first_name}
              required={true}
              size={'lg'}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              touched={touched}
              errors={errors}
            />
            <TextInput
              id="last_name"
              placeholder="Last Name"
              label="Last Name"
              value={values.last_name}
              required={true}
              size={'lg'}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              touched={touched}
              errors={errors}
            />
            {config?.signup?.optionalFields?.includes('company_name') && (
              <TextInput
                id="company_name"
                placeholder="Example, LLC"
                label="Company Name"
                value={values.company_name}
                required={false}
                size={'lg'}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isSubmitting}
                touched={touched}
                errors={errors}
              />
            )}
            <EmailInput
              id="email"
              value={values.email}
              required={true}
              size={'lg'}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              touched={touched}
              errors={errors}
            />
            <PasswordInput
              id="password"
              label="Password"
              placeholder="Enter Password"
              value={values.password}
              required={true}
              size={'lg'}
              helpText={false}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              touched={touched}
              errors={errors}
              showErrors={false}
            />
            <PasswordInput
              id="password_confirmation"
              label="Password Confirmation"
              placeholder="Confirm Password"
              value={values.password_confirmation}
              required={true}
              size={'lg'}
              helpText={false}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              touched={touched}
              errors={errors}
              showErrors={false}
            />
            <PasswordRequirements
              errors={errors.password}
              value={values.password}
            />
            <div className="d-grid gap-2">
              <SubmitButton
                label={config?.signup?.btnLabel || 'Signup'}
                disabled={isSubmitting || !isValid || !isDirty}
              />
            </div>
            <div className="text-center mt-3">
              <small>
                Already have an account? <Link to="/login">Log in</Link>{' '}
                instead.
              </small>
            </div>
          </Form>
        )}
      </Formik>
    </AuthWrapper>
  );
}

export default Signup;
