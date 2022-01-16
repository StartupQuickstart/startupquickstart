import React, { useEffect, useState } from 'react';
import Loading from '@/components/common/Loading';
import { Formik } from 'formik';
import { Form } from 'react-bootstrap';
import FormValidation from '@/lib/form-validation';
import Toast from '@/lib/toast';
import { useApi } from '@/context/providers';

export function UpdateProfile() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});
  const { Api } = useApi();

  useEffect(() => {
    Api.get('users')
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
      await Api.get('users').update('me', values);
      Toast.success('Successfully updated profile');
    } catch (err) {
      if (err?.response?.data?.message) {
        Toast.error(err.response.data.message);
      } else {
        Toast.error('Failed to update profile');
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

    FormValidation.validateRequired('first_name', values, errors);
    FormValidation.validateRequired('last_name', values, errors);
    FormValidation.validateEmail('email', values, errors);
    FormValidation.validateRequired('email', values, errors);
    return errors;
  }

  if (loading) {
    return <Loading small />;
  }

  return (
    <>
      <h4>Update Info</h4>
      <Formik initialValues={user} onSubmit={save} validate={validate}>
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
            <div className="form-group">
              <label className="form-label">
                First Name <span className="text-danger">*</span>
              </label>
              <Form.Control
                id="first_name"
                className="form-control form-control-lg"
                placeholder="First Name"
                defaultValue={values.first_name}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.first_name && errors.first_name}
                disabled={isSubmitting}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.first_name}
              </Form.Control.Feedback>
            </div>
            <div className="form-group">
              <label className="form-label">
                Last Name <span className="text-danger">*</span>
              </label>
              <Form.Control
                id="last_name"
                className="form-control form-control-lg"
                placeholder="Last Name"
                defaultValue={values.last_name}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.last_name && errors.last_name}
                disabled={isSubmitting}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.last_name}
              </Form.Control.Feedback>
            </div>
            <div className="form-group">
              <label className="form-label">
                Email <span className="text-danger">*</span>
              </label>
              <Form.Control
                id="email"
                className="form-control form-control-lg"
                placeholder="first.last@example.com"
                defaultValue={values.email}
                type="email"
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.email && errors.email}
                disabled={isSubmitting}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </div>
            <div className="d-grid gap-2">
              <button
                type="submit"
                className="btn btn-lg btn-primary"
                disabled={isSubmitting || Object.keys(errors).length}
              >
                Update Info
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
