import React from 'react';
import { Formik } from 'formik';
import { Form } from 'react-bootstrap';
import PasswordRequirements from '@/components/auth/PasswordRequirements';
import FormValidation from '@/lib/form-validation';
import Auth from '@/lib/demo/auth';
import Toast from '@/lib/toast';

export class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      passwords: {}
    };
  }

  /**
   *  Saves the form
   *
   * @param {Object} values Form values
   * @param {Object} props Misc properties
   */
  save = async (values, props) => {
    this.setState({ error: null });

    try {
      await Auth.changePassword(values.password);
      Toast.success('Successfully changed password');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        this.setState({ error: err.response.data.message || 'Unknown Error' });
        Toast.error(err.response.data.message);
      } else {
        Toast.error('Failed to change password.');
      }
      props.setSubmitting(false);
      this.setState({ isSubmitting: true });
      throw err;
    }
  };

  /**
   * Validates the from
   *
   * @param {Object} values Form values
   * @param {Object} props Misc properties
   */
  validate = (values, props) => {
    const errors = {};

    FormValidation.validateRequired('password', values, errors);
    FormValidation.validateRequired('password_confirmation', values, errors);
    FormValidation.validatePassword('password', values, errors);

    return errors;
  };

  render() {
    return (
      <Formik
        initialValues={this.state.passwords}
        onSubmit={this.save}
        validate={this.validate}
      >
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
            {this.state.error && (
              <div className="alert alert-danger">{this.state.error}</div>
            )}
            <h4>Change Password</h4>
            <div className="form-group">
              <label className="form-label">
                Password <span className="text-danger">*</span>
              </label>
              <Form.Control
                id="password"
                className="form-control form-control-lg"
                placeholder="Enter Password"
                defaultValue={values.password}
                type="password"
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={touched.password && errors.password}
                disabled={isSubmitting}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">
                Password Confirmation <span className="text-danger">*</span>
              </label>
              <Form.Control
                id="password_confirmation"
                className="form-control form-control-lg"
                placeholder="Confirm Password"
                type="password"
                defaultValue={values.password_confirmation}
                onChange={handleChange}
                onBlur={handleBlur}
                isInvalid={
                  touched.password_confirmation && errors.password_confirmation
                }
                disabled={isSubmitting}
                required
              />
            </div>
            <PasswordRequirements
              errors={errors.password}
              value={values.password}
            />
            <div className="d-grid gap-2">
              <button
                type="submit"
                className="btn btn-lg btn-primary"
                disabled={isSubmitting || Object.keys(errors).length}
              >
                Change Password
              </button>
            </div>
          </Form>
        )}
      </Formik>
    );
  }
}

export default ChangePassword;
