import react from 'react';
import { CopyToClipboard } from './CopyToClipboard';

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
          <CopyToClipboard text={value}>
            <span className="btn-text">Copy</span>
          </CopyToClipboard>
        </span>
      </span>
    );
  }
}

export default Encrypted;
