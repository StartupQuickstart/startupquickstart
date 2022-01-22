import React from 'react';
import moment from 'moment';
import EmailComponent from '../EmailComponent';
import { Box } from 'react-html-email';

export default class _Box extends EmailComponent {
  renderText() {
    return <>{this.props.children}</>;
  }

  renderHtml() {
    return <Box {...this.props}>{this.props.children}</Box>;
  }
}
