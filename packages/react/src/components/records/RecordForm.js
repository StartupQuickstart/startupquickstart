import React, { Fragment, useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { Formik } from 'formik';
import Toast from '@/lib/toast';
import FormValidation from '@/lib/form-validation';
import LoadingOverlay from '../common/LoadingOverlay';
import { useApi } from '@/context/providers';
import RecordInput from './RecordInput';
import { RecordTypeahead } from '../inputs';
import { SubmitButton } from '../buttons';

export function RecordForm({
  recordType,
  mode = 'Create',
  parent,
  onSave,
  record = {},
  singularLabel = 'Record',
  createForm,
  updateForm,
  canAddExisting,
  ...props
}) {
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitAttempt, setSubmitAttempt] = useState(false);
  const { Api } = useApi();

  useEffect(() => {
    setData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Sets the data for the form
   */
  async function setData() {
    try {
      const describe = await await Api.get(recordType).describe();

      const columns = describe.columns.filter((column) => column[`can${mode}`]);
      setColumns(columns);
      setLoading(false);
    } catch (err) {
      console.log(err);
      Toast.error('Unknown Error: Failed to load record metadata.');
    } finally {
      setLoading(false);
    }
  }

  /**
   *  Saves the record
   *
   * @param {Object} values Form values
   * @param {Object} props Misc properties
   */
  async function save(values, props) {
    setLoading(true);
    setSubmitAttempt(true);

    const label = singularLabel?.toLowerCase();
    const id = record?.id || '';

    try {
      let record;

      if (mode === 'Create') {
        values.parent = { ...parent };

        if (parent) {
          record = await Api.get(parent.type).addRelated(
            parent.id,
            recordType,
            values
          );
        } else {
          record = await Api.get(recordType).create(values);
        }

        if (values.id) {
          Toast.success(`Successfully added ${label}`);
        } else {
          Toast.success(`Successfully created ${label}`);
        }
      } else {
        record = await Api.get(recordType).update(id, values);
        Toast.success(`Successfully updated ${label}`);
      }

      onSave && onSave(record);
    } catch (err) {
      if (err?.response?.data?.errors) {
        props?.setErrors(err.response.data.errors);
      }

      if (values.id) {
        Toast.error(`Failed add ${label}`);
      } else {
        Toast.error(`Failed to create ${label}`);
      }

      props?.setSubmitting(false);
      throw err;
    } finally {
      setLoading(false);
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

    for (const column of columns) {
      if (column.required) {
        FormValidation.validateRequired(column.name, values, errors);
      }

      if (column.type === 'email') {
        FormValidation.validateEmail(column.name, values, errors);
      }

      if (column.type === 'password') {
        FormValidation.validatePassword(column.name, values, errors);
      }
    }

    return errors;
  }

  let config = { heading: null, subheading: null, saveBtnLabel: 'Save' };

  switch (mode) {
    case 'Create':
      config = Object.assign(config, createForm);
      break;
    case 'Update':
      config = Object.assign(config, updateForm);
      break;
    default:
      config = Object.assign(config, {});
  }

  return (
    <>
      {loading && <LoadingOverlay />}

      <div className="form-header">
        {config.heading && <h3>{config.heading}</h3>}
        {config.subheading && <p>{config.subheading}</p>}
      </div>

      {canAddExisting && (
        <>
          <div className="form-group">
            <RecordTypeahead
              id={recordType}
              name={recordType}
              onChange={save}
              className="form-control form-control-lg"
              recordType={recordType}
              placeholder={`Select ${singularLabel}`}
              {...props}
            />
          </div>
          <hr />
          <h4>Or Create a New One</h4>
        </>
      )}

      <Formik initialValues={record} onSubmit={save} validate={validate}>
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          isValid,
          isDirty
        }) => {
          return (
            <Form noValidate onSubmit={handleSubmit} autoComplete="off">
              {columns.map((column, index) => {
                if (!column) {
                  return <Fragment key={index} />;
                }

                return (
                  <div className="form-group" key={index}>
                    <label className="form-label">
                      {column.label}{' '}
                      {column.required && (
                        <span className="text-danger">*</span>
                      )}
                    </label>
                    <RecordInput
                      column={column}
                      id={column.name}
                      name={column.name}
                      className="form-control form-control-lg"
                      placeholder={column.label}
                      value={values && values[column.name]}
                      onChange={(value) => {
                        if (value?.target) {
                          handleChange(value);
                        } else {
                          setFieldValue(
                            column.name,
                            value === undefined ? null : value,
                            true
                          );
                        }
                      }}
                      onBlur={handleBlur}
                      isInvalid={
                        (submitAttempt || touched[column.name]) &&
                        errors[column.name]
                      }
                      disabled={isSubmitting}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors[column.name]}
                    </Form.Control.Feedback>
                  </div>
                );
              })}
              <div className="float-end">
                <SubmitButton
                  label={config?.saveBtnLabel}
                  disabled={isSubmitting || isValid || !isDirty}
                  showArrow={false}
                />
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );
}

export default RecordForm;
