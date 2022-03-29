import React, { useState, useEffect } from 'react';
import Loading from '@/components/common/Loading';
import { Formik } from 'formik';
import { Form } from 'react-bootstrap';
import FormValidation from '@/lib/form-validation';
import Toast from '@/lib/toast';
import { useApi } from '@/context/providers';
import { SubmitButton } from '../buttons';

export function UpdateAccount() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const { Api } = useApi();

  useEffect(() => {
    Api.get('accounts')
      .read('me')
      .then((user) => {
        setUser(user);
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   *  Saves the form
   *
   * @param {Object} values Form values
   * @param {Object} props Misc properties
   */
  async function save(values, props) {
    try {
      await Api.get('accounts').update('me', values);
      Toast.success('Successfully updated account');
    } catch (err) {
      if (err?.response?.data?.message) {
        Toast.error(err.response.data.message);
      } else {
        Toast.error('Failed to update account');
      }

      throw err;
    } finally {
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

    FormValidation.validateRequired('name', values, errors);
    FormValidation.validateRequired('website', values, errors);
    return errors;
  }

  if (loading) {
    return <Loading small />;
  }

  return (
    <>
      <h4>Update Account</h4>
      <Formik initialValues={user} onSubmit={save} validate={validate}>
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
            <div className="form-group">
              <label className="form-label">
                Name <span className="text-danger">*</span>
              </label>
              <Form.Control
                id="name"
                className="form-control form-control-lg"
                placeholder="Name"
                defaultValue={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.name && errors.name}
                disabled={isSubmitting}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </div>
            <div className="form-group">
              <label className="form-label">
                Website <span className="text-danger">*</span>
              </label>
              <Form.Control
                id="website"
                className="form-control form-control-lg"
                placeholder="Website"
                defaultValue={values.website}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.website && errors.website}
                disabled={isSubmitting}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.website}
              </Form.Control.Feedback>
            </div>
            <div className="d-grid gap-2">
              <SubmitButton
                label={'Update Account'}
                disabled={isSubmitting || !isValid || !isDirty}
                showArrow={false}
              />
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default UpdateAccount;
