import React, { useState } from 'react';
import { Plus } from 'react-feather';
import classNames from 'classnames';
import { Modal } from 'react-bootstrap';
import RecordForm from './RecordForm';
import { Link } from 'react-router-dom';

export function UpdateRecordButton({
  onClose,
  updateLink,
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

  if (updateLink) {
    return (
      <Link
        to={updateLink}
        className={classNames('btn btn-primary', className)}
        onClick={open}
      >
        <Plus /> Update {singularLabel}
      </Link>
    );
  } else {
    return (
      <>
        <button
          className={classNames('btn btn-primary', className)}
          onClick={open}
        >
          <Plus /> Update {singularLabel}
        </button>
        <Modal show={showModal} size={'lg'} centered onHide={close}>
          <Modal.Header closeButton>
            <Modal.Title>Update {singularLabel}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <RecordForm recordType={recordType} mode="Update" onSave={close} />
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default UpdateRecordButton;
