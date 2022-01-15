import react from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Overlay, Tooltip } from 'react-bootstrap';

export class Encrypted extends react.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      copied: false
    };

    this.copyRef = react.createRef();
    this.ref = react.createRef();
  }

  onCopy = () => {
    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), 500);
  };

  render() {
    const value = this.props.value || '';
    const display = this.state.show
      ? value
      : value.replace(/[a-zA-Z0-9]/g, '*');
    return (
      <span className="encrypted">
        {display}{' '}
        <span className="btn-text-group">
          <span
            className="btn-text"
            onClick={() => this.setState({ show: !this.state.show })}
          >
            {this.state.show ? 'Hide' : 'Show'}
          </span>
          <span className="btn-text-seperator">|</span>
          <Overlay
            show={this.state.copied}
            target={this.copyRef.current}
            container={this.ref.current}
            placement="top"
            containerPadding={20}
          >
            <Tooltip>Copied!</Tooltip>
          </Overlay>
          <CopyToClipboard text={value} onCopy={this.onCopy}>
            <span ref={this.ref}>
              <span ref={this.copyRef} className="btn-text">
                Copy
              </span>
            </span>
          </CopyToClipboard>
        </span>
      </span>
    );
  }
}

export default Encrypted;
