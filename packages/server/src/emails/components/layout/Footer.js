import React from 'react';
import { CardFooter } from '../card';
import { Item } from '../common';
import config from '@/config';
import EmailComponent from '../EmailComponent';

export default class Footer extends EmailComponent {
  renderHtml() {
    return (
      <CardFooter>
        <Item className="text-muted text-sm">
          {config.app.legalName}, {config.app.address}
        </Item>
      </CardFooter>
    );
  }
}
