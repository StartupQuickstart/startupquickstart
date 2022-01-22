import React from 'react';
import EmailComponent from '../EmailComponent';
import { Br } from '.';

export default class Row extends EmailComponent {
  renderText() {
    return (
      <>
        {this.props.children}
        {!this.props.textInline && <Br />}
      </>
    );
  }

  renderHtml() {
    const props = { ...this.props };

    delete props.htmlOnly;
    delete props.textOnly;
    delete props.textLabel;
    delete props.textInline;

    return <tr {...props}>{this.props.children}</tr>;
  }
}
