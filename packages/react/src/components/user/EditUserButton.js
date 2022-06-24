import React, { useState } from 'react';
import { Edit } from 'react-feather';
import { FormLabel, Modal } from 'react-bootstrap';
import { Form, Formik, Field } from 'formik';
import * as Yup from 'yup';
import { useApi } from '@/context';
import { Loading, MultiSelectTypeahead, RecordAction } from '@/components';
import { Toast } from '@/lib';

export function EditUserButton({ onClose, className, userId }) {
  const [user, setUser] = useState();
  const [showModal, setShowModal] = useState();
  const { Api } = useApi();

  function loadUser() {
    if (userId) {
      Api.get('users').read(userId).then(setUser);
    }
  }

  /**
   * Closes the create form modal
   */
  function close() {
    setUser(null);
    onClose && onClose();
    setShowModal(false);
  }

  /**
   * Opens the create form modal
   */
  function open() {
    setShowModal(true);
    loadUser();
  }

  /**
   * Saves the user
   * @param {*} values
   */
  async function save(values) {
    await Toast.promise(Api.get('users').update(userId, values), {
      success: 'Successfully updated user',
      error: {
        render({ data }) {
          return `Failed to update user: ${JSON.stringify(data.response.data)}`;
        }
      },
      pending: 'Updating user'
    }).then(close);
  }

  const FormSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
      .email('Invalid email')
      .required('Email Address is required'),
    roles: Yup.array()
      .min(1, 'At least one role is required')
      .of(
        Yup.mixed().oneOf(['Admin', 'Basic', 'Ticket Partner']),
        'Invalid role'
      )
  });

  return (
    <>
      <RecordAction onClick={() => open()} tooltip="Edit" asText={true}>
        <Edit />
      </RecordAction>
      <Modal show={showModal} size={'lg'} centered onHide={close}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!user && <Loading />}
          {user && (
            <Formik
              initialValues={user}
              onSubmit={save}
              validationSchema={FormSchema}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                setFieldValue,
                isValid,
                dirty
              }) => (
                <Form>
                  <div className="form-group">
                    <FormLabel htmlFor="name">User Id</FormLabel>
                    <Field
                      className="form-control"
                      id="user_id"
                      name="user_id"
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <Field
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Full Name"
                      className={
                        touched.name && errors.name
                          ? 'form-control is-invalid'
                          : 'form-control'
                      }
                    />
                    {touched.name && errors.name ? (
                      <div className="invalid-feedback">{errors.name}</div>
                    ) : null}
                  </div>
                  <div className="form-group">
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Email Address"
                      className={
                        touched.email && errors.email
                          ? 'form-control is-invalid'
                          : 'form-control'
                      }
                    />
                    {touched.email && errors.email ? (
                      <div className="invalid-feedback">{errors.email}</div>
                    ) : null}
                  </div>
                  <div className="form-group">
                    <FormLabel htmlFor="name">Roles</FormLabel>
                    <MultiSelectTypeahead
                      id="roles"
                      name="roles"
                      options={['Admin', 'Basic', 'Ticket Partner']}
                      placeholder="Select Roles (Required)"
                      className={
                        touched.roles && errors.roles ? 'is-invalid' : ''
                      }
                    />
                    {touched.roles && errors.roles ? (
                      <div className="invalid-feedback">{errors.roles}</div>
                    ) : null}
                  </div>
                  <div>
                    <button
                      className="btn btn-light me-1"
                      type="button"
                      onClick={close}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary"
                      type="submit"
                      disabled={!(isValid && dirty)}
                    >
                      Save Changes
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default EditUserButton;
