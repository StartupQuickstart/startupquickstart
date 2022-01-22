import React from 'react';
import Item from './Item';
import EmailComponent from '../EmailComponent';

export default class P extends EmailComponent {
  renderText() {
    return <>{this.props.children}</>;
  }

  renderHtml() {
    const props = { ...this.props };
    return (
      <Item className="p" {...props}>
        {this.props.children}
      </Item>
    );
  }
}
