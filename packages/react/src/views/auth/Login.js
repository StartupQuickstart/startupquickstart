import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import { Form } from 'react-bootstrap';
import FormValidation from '../../lib/form-validation';
import { useAuth } from '../../context/providers';

import { PasswordInput, EmailInput } from '../../components/inputs';
import AuthWrapper from './components/AuthWrapper';
import { SubmitButton } from '../../components/buttons';

export function Login(props) {
  const { authenticate } = useAuth();
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Submits the form
   *
   * @param {Object} values Submitted values
   */
  async function submit(values) {
    setError(null);
    setSubmitting(true);

    const { email, password } = values;

    try {
      authenticate(email, password);
    } catch (err) {
      if (err?.response?.data?.message) {
        setError(err.response.data.message || 'Unknown Error');
      }

      if (err?.response?.status === 401) {
        setError('Invalid email and password combination.');
      }

      throw err;
    } finally {
      setSubmitting(false);
    }
  }

  /**
   * Validates the form
   *
   * @param {Object} values Submitted values
   */
  function validate(values) {
    const errors = {};

    FormValidation.validateEmail('email', values, errors);
    FormValidation.validateRequired('email', values, errors);
    FormValidation.validateRequired('password', values, errors);
    return errors;
  }

  return (
    <AuthWrapper
      title={'Enter your email and password'}
      isSubmitting={isSubmitting}
    >
      <Formik initialValues={{}} onSubmit={submit} validate={validate}>
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting
        }) => (
          <Form noValidate onSubmit={handleSubmit} autoComplete="off">
            {error && <div className="alert alert-danger">{error}</div>}
            <EmailInput
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              touched={touched}
              errors={errors}
              required={true}
              size={'lg'}
            />
            <PasswordInput
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              touched={touched}
              errors={errors}
              required={true}
              size={'lg'}
            />
            <div className="d-grid gap-2">
              <SubmitButton
                label={'Login'}
                isSubmitting={isSubmitting}
                error={errors}
              />
            </div>
            <div className="text-center mt-3">
              <small>
                Don't have an account? <Link to="/signup">Sign up</Link>{' '}
                instead.
              </small>
            </div>
          </Form>
        )}
      </Formik>
    </AuthWrapper>
  );
}

export default Login;
