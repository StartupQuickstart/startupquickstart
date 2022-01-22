import React from 'react';
import { Item, Box } from '../common';
import EmailComponent from '../EmailComponent';

export default class CardFooter extends EmailComponent {
  renderHtml() {
    return (
      <Item className="card-footer">
        <Box width="100%">{this.props.children}</Box>
      </Item>
    );
  }
}
