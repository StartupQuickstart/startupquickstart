import React from 'react';
import { Item, Box } from '../common';
import EmailComponent from '../EmailComponent';

export default class Card extends EmailComponent {
  renderHtml() {
    return (
      <Item className={`card ${this.props.className || ''}`}>
        <Box width="100%">{this.props.children}</Box>
      </Item>
    );
  }
}
