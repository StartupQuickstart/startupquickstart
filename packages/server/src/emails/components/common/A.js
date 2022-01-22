import React from 'react';
import EmailComponent from '../EmailComponent';
import { Br } from '.';

export default class A extends EmailComponent {
  renderText() {
    const textInline = this.props.textInline === true;

    return (
      <>
        {this.props.children}
        {!textInline ? <Br /> : ' '}
        {this.props.href}
        {!textInline ? <Br /> : ' '}
      </>
    );
  }

  renderHtml() {
    const props = { ...this.props };

    delete props.htmlOnly;
    delete props.textOnly;
    delete props.textLabel;
    delete props.textInline;

    return <a {...props}>{this.props.children}</a>;
  }
}
