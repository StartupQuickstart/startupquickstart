import React from 'react';
import moment from 'moment';
import EmailComponent from '../EmailComponent';
import { Email } from 'react-html-email';

export default class _Email extends EmailComponent {
  renderText() {
    return <>{this.props.children}</>;
  }

  renderHtml() {
    return <Email {...this.props}>{this.props.children}</Email>;
  }
}
