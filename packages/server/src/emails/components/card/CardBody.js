import React from 'react';
import { Item, Box } from '../common';
import EmailComponent from '../EmailComponent';

export default class CardBody extends EmailComponent {
  renderHtml() {
    return (
      <Item
        className={`card-body ${this.props.className || ''}`}
        textInline={this.props.textInline}
      >
        <Box width="100%">{this.props.children}</Box>
      </Item>
    );
  }
}
