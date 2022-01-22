import React from 'react';
import EmailComponent from '../EmailComponent';

export default class Span extends EmailComponent {
  renderText() {
    return <>{this.props.children}</>;
  }

  renderHtml() {
    return <span {...this.props}>{this.props.children}</span>;
  }
}
