import React from 'react';
import EmailComponent from '../EmailComponent';

export default class Br extends EmailComponent {
  renderText() {
    return <>\r\n</>;
  }

  renderHtml() {
    return <br />;
  }
}
