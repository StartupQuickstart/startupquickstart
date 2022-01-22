import React from 'react';
import EmailComponent from '../EmailComponent';

export default class B extends EmailComponent {
  renderText() {
    return <>{this.props.children}</>;
  }

  renderHtml() {
    const props = { ...this.props };

    delete props.htmlOnly;
    delete props.textOnly;
    delete props.textLabel;

    return <b {...props}>{this.props.children}</b>;
  }
}
