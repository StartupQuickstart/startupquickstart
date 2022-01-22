import React from 'react';
import moment from 'moment';
import EmailComponent from '../EmailComponent';
import { Item } from 'react-html-email';
import { Br } from '.';

export default class _Item extends EmailComponent {
  renderText() {
    return (
      <>
        {this.props.children}
        {!this.props.textInline && <Br />}
      </>
    );
  }

  renderHtml() {
    return <Item {...this.props}>{this.props.children}</Item>;
  }
}
