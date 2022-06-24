import React, { useState } from 'react';
import { Plus, Send, X } from 'react-feather';
import classNames from 'classnames';
import { Modal } from 'react-bootstrap';
import { Form, Formik, Field } from 'formik';
import * as Yup from 'yup';
import { MultiSelectTypeahead, Tooltip } from '@/components';
import { useApi } from '@/context';

export function InviteUserButton({ onClose, className }) {
  const [showModal, setShowModal] = useState();
  const { Api } = useApi();

  /**
   * Closes the create form modal
   */
  function close() {
    onClose && onClose();
    setShowModal(false);
  }

  /**
   * Opens the create form modal
   */
  function open() {
    setShowModal(true);
  }

  /**
   * Sends the invite
   * @param {Object} values Form values
   */
  async function sendInvites({ invitees }) {
    try {
      await Api.get('users').sendInvites(invitees);
      close();
    } catch (err) {
      console.log(err);
    }
  }

  const InviteSchema = Yup.object().shape({
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

  const FormSchema = Yup.object().shape({
    invitees: Yup.array().of(InviteSchema)
  });

  return (
    <>
      <Tooltip tooltip={'Invite User'}>
        <button
          className={classNames('btn btn-primary', className)}
          onClick={open}
        >
          <Send /> Invite User
        </button>
      </Tooltip>
      <Modal show={showModal} size={'lg'} centered onHide={close}>
        <Modal.Header closeButton>
          <Modal.Title>Invite User to Organization</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Send Invites by Email</h4>
          <p>
            You must specify an email address and roles to send invitations.
          </p>
          <Formik
            initialValues={{
              invitees: [{ email: '', roles: [] }]
            }}
            onSubmit={sendInvites}
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
                {values.invitees.map((invite, index) => (
                  <div key={index} className="row">
                    <div className="form-group col">
                      <Field
                        id={`invitees[${index}].email`}
                        name={`invitees[${index}].email`}
                        type="email"
                        placeholder="Enter Email Address (Required)"
                        className={
                          touched.invitees?.[index]?.email &&
                          errors.invitees?.[index]?.email
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                      />
                      {touched.invitees?.[index]?.email &&
                      errors.invitees?.[index]?.email ? (
                        <div className="invalid-feedback">
                          {errors.invitees?.[index]?.email}
                        </div>
                      ) : null}{' '}
                    </div>
                    <div className="form-group col">
                      <MultiSelectTypeahead
                        id={`invitees[${index}].roles`}
                        name={`invitees[${index}].roles`}
                        options={['Admin', 'Basic', 'Ticket Partner']}
                        placeholder="Select Roles (Required)"
                        className={
                          touched.invitees?.[index]?.roles &&
                          errors.invitees?.[index]?.roles
                            ? 'is-invalid'
                            : ''
                        }
                      />
                      {touched.invitees?.[index]?.roles &&
                      errors.invitees?.[index]?.roles ? (
                        <div className="invalid-feedback">
                          {errors.invitees?.[index]?.roles}
                        </div>
                      ) : null}
                    </div>
                    <div className="form-group col-1 text-center">
                      <span
                        className="btn-text btn-text-lg"
                        onClick={() => {
                          const newInvites = [...values.invitees];
                          newInvites.splice(index, 1);
                          setFieldValue('invitees', newInvites);
                        }}
                      >
                        <X />
                      </span>
                    </div>
                  </div>
                ))}
                <div className="mb-4">
                  <span
                    className="btn-text"
                    onClick={() => {
                      setFieldValue('invitees', [
                        ...values.invitees,
                        { email: '', roles: [] }
                      ]);
                    }}
                  >
                    <Plus /> Invite More
                  </span>
                  <small className="float-end  text-muted">
                    Max 5 invitations
                  </small>
                </div>
                <button
                  className="btn btn-primary"
                  type="submit"
                  disabled={!(isValid && dirty)}
                >
                  Send Invite(s)
                </button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default InviteUserButton;
