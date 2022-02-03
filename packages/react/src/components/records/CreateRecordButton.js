import React, { useState } from 'react';
import { Plus } from 'react-feather';
import classNames from 'classnames';
import { Modal } from 'react-bootstrap';
import RecordForm from './RecordForm';
import { Link } from 'react-router-dom';

export function CreateRecordButton({
  onClose,
  createLink,
  className,
  singularLabel = 'Record',
  recordType
}) {
  const [showModal, setShowModal] = useState();

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

  if (createLink) {
    return (
      <Link
        to={createLink}
        className={classNames('btn btn-primary', className)}
        onClick={open}
      >
        <Plus /> Create {singularLabel}
      </Link>
    );
  } else {
    return (
      <>
        <button
          className={classNames('btn btn-primary', className)}
          onClick={open}
        >
          <Plus /> Create {singularLabel}
        </button>
        <Modal show={showModal} size={'lg'} centered onHide={close}>
          <Modal.Header closeButton>
            <Modal.Title>Create {singularLabel}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <RecordForm recordType={recordType} mode="Create" onSave={close} />
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default CreateRecordButton;
