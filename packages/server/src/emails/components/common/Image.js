import React from 'react';
import moment from 'moment';
import EmailComponent from '../EmailComponent';
import { Image } from 'react-html-email';

export default class _Image extends EmailComponent {
  renderText() {
    return <>{this.props.children}</>;
  }

  renderHtml() {
    return <Image {...this.props}>{this.props.children}</Image>;
  }
}
