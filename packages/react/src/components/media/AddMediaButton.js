import React from 'react';
import { Plus } from 'react-feather';
import classNames from 'classnames';
import { Modal } from 'react-bootstrap';
import FileUpload from 'components/inputs/FileUpload';

export class AddMediaButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = { showModal: false };

    this.modalRef = React.createRef();
  }

  /**
   * Closes the create form modal
   */
  close = () => {
    this.setState({ showModal: false });

    if (this.props.onClose) {
      this.props.onClose();
    }
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
    return (
      <>
        <button
          className={classNames('btn btn-primary', this.props.className)}
          onClick={this.open}
        >
          <Plus /> Add Media
        </button>
        <Modal
          show={this.state.showModal}
          size={'lg'}
          centered
          onHide={this.close}
        >
          <Modal.Header closeButton>
            <Modal.Title>Add Media</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FileUpload
              accept={['pdf, video/*, image/*']}
              params={this.props.params}
            />
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default AddMediaButton;
