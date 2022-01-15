import React, { useState } from 'react';
import { ArrowRight } from 'react-feather';
import Toast from '../../lib/toast';
// import SupportEmail from 'core/components/common/SupportEmail';
import { useAuth, useConfig } from 'context/providers';
import { Formik } from 'formik';
import { Form } from 'react-bootstrap';
import AuthWrapper from 'components/auth/AuthWrapper';
import SupportEmail from 'components/common/SupportEmail';

export function Activate() {
  const { activate, user, sendActivationLink } = useAuth();
  const { config } = useConfig();
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Submits the form to activate the account
   */
  async function submit({ code }) {
    setError(null);
    setSubmitting(true);

    try {
      activate(code);
    } catch (err) {
      Toast.error(
        'Failed to activate account. Invalid or expired validation code.'
      );
      throw err;
    } finally {
      setSubmitting(false);
    }
  }

  /**
   * Sends the activation code to the user
   */
  async function sendActivationCode() {
    setError(null);
    setSubmitting(true);

    try {
      await sendActivationLink();

      Toast.success(
        'Success! Please check your email for a new activation code.'
      );
    } catch (err) {
      Toast.error('Failed to send a new activation code. Please try agian.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthWrapper
      title={'Activate your account'}
      expectAuthenticated={true}
      subTitle={
        <>
          Please enter the 4-digit code we sent to <b>{user?.email}</b>
        </>
      }
      isSubmitting={isSubmitting}
      setupProgress={{ active: 'activate', completed: ['signup'] }}
    >
      {' '}
      <Formik initialValues={{}} onSubmit={submit}>
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
            <div className="input-group mb-3" style={{ width: '240px' }}>
              <input
                type="text"
                className="form-control px-3"
                placeholder="••••"
                minLength="4"
                maxLength="4"
                style={{ letterSpacing: '14px' }}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <button
                className="btn btn-lg btn-primary"
                type="button"
                onClick={activate}
                disabled={!(values.code && values.code.length === 4)}
              >
                Activate <ArrowRight />
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <div className="mt-4">
        <b>Didn't receive an email?</b>
        <ul className="pt-2">
          <li>Check your spam folder</li>
          <li>
            <span className="text-link" onClick={sendActivationCode}>
              Send a new code
            </span>{' '}
            to {user?.email}
          </li>
          {config?.SupportEmail && (
            <li>
              Contact <SupportEmail />
            </li>
          )}
        </ul>
      </div>
    </AuthWrapper>
  );
}

export default Activate;
