import React from 'react';
import { Item, Box } from '../common';
import EmailComponent from '../EmailComponent';

export default class CardHeader extends EmailComponent {
  renderHtml() {
    return (
      <Item className="card-header">
        <Box width="100%">{this.props.children}</Box>
      </Item>
    );
  }
}
