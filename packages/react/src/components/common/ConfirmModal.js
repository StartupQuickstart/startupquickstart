import React from 'react';
import classnames from 'classnames';
import { Modal } from 'react-bootstrap';

export class ConfirmModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getDefaultState();
  }

  /**
   * Gets the default state for teh view
   */
  getDefaultState = () => {
    return {
      show: false
    };
  };

  /**
   * Closes the modal
   */
  close = () => {
    this.setState(this.getDefaultState(), () => {
      if (this.props.onClose) {
        this.props.onClose();
      }
    });
  };

  /**
   *
   * @param {Opens the modal} path
   * @param {*} record
   */
  open = (path, record) => {
    const state = { show: true };
    this.setState(state);
  };

  /**
   * Confirms the request
   */
  confirm = () => {
    if (this.props.onConfirm) {
      this.props.onConfirm();
    }

    this.close();
  };

  render() {
    return (
      <Modal
        show={this.state.show}
        size={this.props.size || 'sm'}
        centered
        onHide={this.close}
      >
        <Modal.Header>{this.props.title}</Modal.Header>
        <Modal.Body>{this.props.message || this.props.children}</Modal.Body>
        <Modal.Footer>
          <button
            className={classnames('btn', this.props.cancelBtnClass)}
            onClick={this.close}
          >
            {this.props.cancelBtnLabel || 'Cancel'}
          </button>
          <button
            className={classnames('btn', this.props.confirmBtnClass)}
            onClick={this.confirm}
          >
            {this.props.confirmBtnLabel || 'Confirm'}
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
}

ConfirmModal.defaultProps = {
  confirmBtnClass: 'btn-primary',
  cancelBtnClass: 'btn-white'
};

export default ConfirmModal;
