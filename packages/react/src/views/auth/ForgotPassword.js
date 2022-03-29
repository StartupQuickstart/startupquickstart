import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { Formik } from 'formik';
import FormValidation from '../../lib/form-validation';
import Toast from '../../lib/toast';
import SupportEmail from '@/components/common/SupportEmail';
import AuthWrapper from '@/components/auth/AuthWrapper';
import { useAuth } from '@/context/providers';
import { SubmitButton } from '@/components/buttons';
import { EmailInput } from '@/components/inputs';

const defaultTitle = {
  title: 'Forgot your password?',
  subTitle: 'Enter your email so we can send a password reset link.'
};

export function ForgotPassword(props) {
  const { sendResetPasswordLink } = useAuth();
  const [isSubmitting, setSubmitting] = useState(false);
  const [linkSent, _setLinkSent] = useState(false);
  const [email, setEmail] = useState(false);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState(defaultTitle);

  function setLinkSent(linkSent) {
    _setLinkSent(linkSent);

    const linkSentTitle = {
      title: 'Success',
      subTitle: (
        <>
          We have sent an email with password reset instructions to{' '}
          <span className="text-primary">{email}</span> if it exists in our
          database.
          <br />
          <br />
          <b>Didn't receive an email?</b>
          <br />
          <br />
          Please check your spam folder and contact <SupportEmail /> if the
          problem persists.
        </>
      )
    };

    if (linkSent) {
      setTitle(linkSentTitle);
    } else {
      setTitle(defaultTitle);
    }
  }

  /**
   * Handles form submissions
   *
   * @param {Object} values Form values
   * @param {Object} props props sent form form
   */
  async function submit({ email }, props) {
    setError(null);
    setSubmitting(true);

    try {
      await sendResetPasswordLink(email);
      setLinkSent(true);
      setEmail(email);
    } catch (err) {
      if (err?.response?.data?.message) {
        Toast.error(err.response.data.message);
      } else {
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

    FormValidation.validateEmail('email', values, errors);
    return errors;
  }

  return (
    <AuthWrapper
      title={title.title}
      subTitle={title.subTitle}
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
          isSubmitting,
          isValid,
          isDirty
        }) => (
          <Form noValidate onSubmit={handleSubmit} autoComplete="off">
            {error && <div className="alert alert-danger">{error}</div>}
            {!linkSent && (
              <>
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
                <div className="d-grid gap-2">
                  <SubmitButton
                    label={'Send reset link'}
                    isSubmitting={isSubmitting}
                    disabled={isSubmitting || !isValid || !isDirty}
                  />
                </div>
                <div className="text-center mt-3">
                  <small>
                    Remember your password? <Link to="/login">Log in</Link>{' '}
                    instead.
                  </small>
                </div>
              </>
            )}
          </Form>
        )}
      </Formik>
    </AuthWrapper>
  );
}

export default ForgotPassword;
