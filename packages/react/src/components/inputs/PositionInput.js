import React from 'react';
import { Form } from 'react-bootstrap';

export class PositionInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    const defaultValue = this.props.defaultValue || {};

    if (this.props.type === 'x') {
      this.state.position = defaultValue.left ? 'left' : 'right';
    } else {
      this.state.position = defaultValue.bottom ? 'bottom' : 'top';
    }

    this.state.value = defaultValue[this.state.position];
  }

  /**
   * Gets the opposite position of the one passed in
   *
   * @param {String} position Position to get the opposite of
   */
  getOppositePosition = (position) => {
    return { left: 'right', right: 'left', top: 'bottom', bottom: 'top' }[
      position
    ];
  };

  /**
   * Handles on change events.
   * Should call on change for each property that is being updated to work with FORMIK
   *
   * @param {Object} data Current data to pass along
   */
  onChange(data) {
    if (this.props.onChange) {
      ['top', 'bottom', 'left', 'right'].forEach((prop) =>
        this.props.onChange({
          target: {
            id: this.props.name + '.' + prop,
            value: data[prop]
          }
        })
      );
    }
  }

  /**
   * Handles position changes
   *
   * @param {String} position Position to set
   */
  onPositionChange = (position) => {
    const value = this.props.defaultValue ? { ...this.props.defaultValue } : {};
    const oppositePosition = this.getOppositePosition(position);

    value[position] = this.state.value;
    delete value[oppositePosition];
    this.setState({ position });

    this.onChange(value);
  };

  /**
   * Handles value changes
   *
   * @param {String} value Value to set
   */
  onValueChange = (value) => {
    const _value = this.props.defaultValue
      ? { ...this.props.defaultValue }
      : {};
    const oppositePosition = this.getOppositePosition(this.state.position);

    _value[this.state.position] = value;
    delete _value[oppositePosition];
    this.setState({ value });

    this.onChange(_value);
  };

  render() {
    return (
      <div className="input-group">
        <Form.Control
          as="select"
          className="form-select"
          value={this.state.position}
          onChange={({ target }) => this.onPositionChange(target.value)}
          disabled={this.props.disabled}
        >
          {this.props.type === 'x' && (
            <>
              <option value="left">Left</option>
              <option value="right">Right</option>
            </>
          )}
          {this.props.type === 'y' && (
            <>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
            </>
          )}
        </Form.Control>
        <input
          type="text"
          placeholder={this.props.placeholder || '15px'}
          className="form-control"
          defaultValue={this.state.value}
          onChange={({ target }) => this.onValueChange(target.value)}
          disabled={this.props.disabled}
        />
      </div>
    );
  }
}

export default PositionInput;
