import React from 'react';
import EmailComponent from '../EmailComponent';
import Button from './Button';

export default class SuccessButton extends EmailComponent {
  renderHtml() {
    return (
      <Button
        size={this.props.size}
        href={this.props.href}
        className={`btn-success ${this.props.className}`}
      >
        {this.props.children}
      </Button>
    );
  }
}
