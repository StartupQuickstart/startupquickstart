import React, { useState } from 'react';
import { Edit2, Plus } from 'react-feather';
import classNames from 'classnames';
import { Modal } from 'react-bootstrap';
import RecordForm from './RecordForm';
import { Link } from 'react-router-dom';
import { Tooltip } from '@/components/common';

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
  canAddExisting = false,
  mode,
  createForm
}) {
  const [showModal, setShowModal] = useState();

  /**
   * Closes the create form modal
   */
  function close(record) {
    onClose && onClose(record);
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
  label = label || title;

  const Icon = btn.icon;

  const ButtonTo = () => (
    <Tooltip tooltip={iconOnly && label}>
      <button
        className={classNames('btn btn-primary', className)}
        onClick={open}
      >
        <Icon /> {!iconOnly && label}
      </button>
    </Tooltip>
  );

  const TextTo = () => (
    <Tooltip tooltip={iconOnly && label}>
      <span className={classNames('btn-text', className)} onClick={open}>
        <Icon /> {!iconOnly && label}
      </span>
    </Tooltip>
  );

  const ButtonLink = () => (
    <Tooltip tooltip={iconOnly && label}>
      <Link
        to={link}
        className={classNames('btn btn-primary', className)}
        onClick={open}
      >
        <Edit2 /> {!iconOnly && label}
      </Link>
    </Tooltip>
  );

  const TextLink = () => (
    <Tooltip tooltip={iconOnly && label}>
      <Link
        to={link}
        className={classNames('btn-text', className)}
        onClick={open}
      >
        <Edit2 /> {!iconOnly && label}
      </Link>
    </Tooltip>
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
              canAddExisting={canAddExisting}
              mode={mode}
              onSave={close}
              record={record}
              createForm={createForm}
            />
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default RecordButton;
