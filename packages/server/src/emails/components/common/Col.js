import React from 'react';
import EmailComponent from '../EmailComponent';
import { Br } from '.';

export default class Col extends EmailComponent {
  renderText() {
    const textInline = this.props.textInline === true;
    const wSeperator = this.props.textInlineSeperator === true;

    return (
      <>
        {this.props.children}
        {!textInline && !wSeperator ? <Br /> : wSeperator ? ' / ' : ' '}
      </>
    );
  }

  renderHtml() {
    const props = { ...this.props };

    delete props.htmlOnly;
    delete props.textOnly;
    delete props.textLabel;
    delete props.textInlineSeperator;
    delete props.textInline;

    return <td {...props}>{this.props.children}</td>;
  }
}
