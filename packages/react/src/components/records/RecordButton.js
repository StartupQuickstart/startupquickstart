import React, { useState } from 'react';
import { Edit2, Plus } from 'react-feather';
import classNames from 'classnames';
import { Modal } from 'react-bootstrap';
import RecordForm from './RecordForm';
import { Link } from 'react-router-dom';

export function RecordButton({
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

  let btn;
  switch (mode) {
    case 'Create':
      btn = parent
        ? { icon: Plus, title: 'Add' }
        : { icon: Plus, title: 'Create' };
      break;
    case 'Update':
      btn = { icon: Edit2, title: 'Update' };
      break;
    default:
      break;
  }

  const title = `${btn.title} ${singularLabel}`;
  label = iconOnly ? '' : label || title;

  const Icon = btn.icon;

  const ButtonTo = () => (
    <button className={classNames('btn btn-primary', className)} onClick={open}>
      <Icon /> {label}
    </button>
  );

  const TextTo = () => (
    <span className={classNames('btn-text', className)} onClick={open}>
      <Icon /> {label}
    </span>
  );

  const ButtonLink = () => (
    <Link
      to={link}
      className={classNames('btn btn-primary', className)}
      onClick={open}
    >
      <Edit2 /> {label}
    </Link>
  );

  const TextLink = () => (
    <Link
      to={link}
      className={classNames('btn-text', className)}
      onClick={open}
    >
      <Edit2 /> {!label}
    </Link>
  );

  if (link) {
    if (asText) {
      return <TextLink />;
    } else {
      return <ButtonLink />;
    }
  } else {
    return (
      <>
        {asText && <TextTo />}
        {!asText && <ButtonTo />}
        <Modal show={showModal} size={'lg'} centered onHide={close}>
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <RecordForm
              recordType={recordType}
              singularLabel={singularLabel}
              parent={parent}
              mode={mode}
              onSave={close}
              record={record}
            />
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default RecordButton;
