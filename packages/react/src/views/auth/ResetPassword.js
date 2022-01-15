import React, { useEffect, useState } from 'react';
import qs from 'qs';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import FormValidation from '../../lib/form-validation';
import Toast from '../../lib/toast';
import { PasswordRequirements } from 'components/auth/PasswordRequirements';
import { useAuth } from 'context/providers';
import jwtDecode from 'jwt-decode';
import AuthWrapper from 'components/auth/AuthWrapper';
import { SubmitButton } from 'components/buttons';
import { PasswordInput } from 'components/inputs';
import { Form } from 'react-bootstrap';
import { ArrowRight } from 'react-feather';

const defaultTitle = {
  title: 'Reset your password',
  subTitle: 'Enter your email so we can send a password reset link.'
};

const expiredTitle = {
  title: 'Expired Token',
  subTitle: (
    <>
      <span>
        Your token has expired. Please request another password reset link.
      </span>
      <br />
      <br />
      <Link to="/forgot-password" className="btn btn-lg btn-primary">
        Request another link <ArrowRight />
      </Link>
    </>
  )
};

export function ResetPassword(props) {
  const { resetPassword } = useAuth();
  const [token, setToken] = useState(null);
  const [isExpired, setExpired] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState(defaultTitle);

  useEffect(() => {
    const query = qs.parse(window.location?.search, {
      ignoreQueryPrefix: true
    });
    setToken(query.token);

    const payload = query.token ? jwtDecode(query.token) : null;
    const isExpired = payload?.exp ? payload.exp < Date.now() / 1000 : true;
    setExpired(isExpired);

    if (isExpired) {
      setTitle(expiredTitle);
    } else {
      setTitle(defaultTitle);
    }
  }, []);

  /**
   * Handles form submissions
   *
   * @param {Object} values Form values
   * @param {Object} props props sent form form
   */
  async function submit({ password }, props) {
    setError(null);
    setSubmitting(true);

    try {
      await resetPassword(password, token);
      Toast.success('Success! Your password has been reset.');
    } catch (err) {
      if (err?.response?.data?.message) {
        Toast.error(err.response.data.message);
      } else {
        console.log(err);
        Toast.error('Unknown Error');
      }

      throw err;
    } finally {
      setSubmitting(false);
      props.setSubmitting(false);
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

    FormValidation.validateRequired('password', values, errors);
    FormValidation.validateRequired('password_confirmation', values, errors);

    FormValidation.validatePassword('password', values, errors);
    return errors;
  }

  return (
    <AuthWrapper
      isSubmitting={isSubmitting}
      title={title.title}
      subTitle={title.subTitle}
    >
      {!isExpired && (
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
                  label={'Set Password'}
                  isSubmitting={isSubmitting}
                  error={errors}
                />
              </div>
              <div className="text-center mt-3">
                <small>
                  Remember your password? <Link to="/login">Log in</Link>{' '}
                  instead.
                </small>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </AuthWrapper>
  );
}

export default ResetPassword;
