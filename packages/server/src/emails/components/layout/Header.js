import React from 'react';
import { CardHeader } from '../card';
import { Logo } from '../common';
import EmailComponent from '../EmailComponent';

export default class Header extends EmailComponent {
  renderHtml() {
    return (
      <CardHeader>
        <Logo />
      </CardHeader>
    );
  }
}
