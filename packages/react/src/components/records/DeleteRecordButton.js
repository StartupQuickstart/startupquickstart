import React, { useState } from 'react';
import { X } from 'react-feather';
import classNames from 'classnames';
import { Modal } from 'react-bootstrap';
import { useApi } from '@/context';
import { Toast } from '@/lib';

export function DeleteRecordButton({
  onClose,
  link,
  className,
  singularLabel = 'Record',
  recordType,
  parent,
  record,
  label,
  asText = false,
  iconOnly = false,
  mode
}) {
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
   * Deletes a record
   */
  async function destroy() {
    try {
      if (parent) {
        record = await Api.get(parent.type).removeRelated(
          parent.id,
          recordType,
          record.id
        );
        Toast.success(`Successfully removed ${singularLabel.toLowerCase()}`);
      } else {
        await Api.get(recordType).delete(record.id);
        Toast.success(`Successfully deleted ${singularLabel.toLowerCase()}`);
      }
    } catch (err) {
      console.log(err);

      if (parent) {
        Toast.error(`Failed to remove ${singularLabel.toLowerCase()}`);
      } else {
        Toast.error(`Failed to delete ${singularLabel.toLowerCase()}`);
      }
    } finally {
      close();
    }
  }

  const title = `${parent ? 'Unassociate' : 'Delete'} ${singularLabel}`;
  label = iconOnly ? '' : label || title;

  const ButtonTo = () => (
    <button className={classNames('btn btn-primary', className)} onClick={open}>
      <X /> {label}
    </button>
  );

  const TextTo = () => (
    <span className={classNames('btn-text', className)} onClick={open}>
      <X /> {label}
    </span>
  );

  return (
    <>
      {asText && <TextTo />}
      {!asText && <ButtonTo />}
      <Modal show={showModal} size={'sm'} centered onHide={close}>
        <Modal.Header>
          <Modal.Title>
            Are you sure you want to {parent ? 'remove' : 'delete'} this{' '}
            {singularLabel.toLowerCase()}?
          </Modal.Title>
        </Modal.Header>
        <Modal.Footer className="float-end">
          <button className="btn btn-lg btn-white me-2" onClick={close}>
            Cancel
          </button>
          <button className="btn btn-lg btn-danger" onClick={destroy}>
            {parent ? 'Remove' : 'Delete'}
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteRecordButton;
