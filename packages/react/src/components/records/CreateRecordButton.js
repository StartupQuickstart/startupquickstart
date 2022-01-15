import React from 'react';
import { Plus } from 'react-feather';
import classNames from 'classnames';
import { Modal } from 'react-bootstrap';
import RecordForm from './RecordForm';
import { Link } from 'react-router-dom';

export class CreateRecordButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = { showModal: false };

    this.modalRef = React.createRef();
  }

  /**
   * Closes the create form modal
   */
  close = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }

    this.setState({ showModal: false });
  };

  /**
   * Opens the create form modal
   */
  open = () => {
    this.setState({
      showModal: true
    });
  };

  render() {
    return !this.props.createLink ? (
      <>
        <button
          className={classNames('btn btn-primary', this.props.className)}
          onClick={this.open}
        >
          <Plus /> Create {this.props.singularLabel}
        </button>
        <Modal
          show={this.state.showModal}
          size={'lg'}
          centered
          onHide={this.close}
        >
          <Modal.Header closeButton>
            <Modal.Title>Create {this.props.singularLabel}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <RecordForm
              recordType={this.props.recordType}
              mode="Create"
              {...this.props}
              onSave={this.close}
            />
          </Modal.Body>
        </Modal>
      </>
    ) : (
      <Link
        to={this.props.createLink}
        className={classNames('btn btn-primary', this.props.className)}
        onClick={this.open}
      >
        <Plus /> Create {this.props.singularLabel}
      </Link>
    );
  }
}

CreateRecordButton.defaultProps = {
  singularLabel: 'Record',
  pluralLabel: 'Records'
};

export default CreateRecordButton;
