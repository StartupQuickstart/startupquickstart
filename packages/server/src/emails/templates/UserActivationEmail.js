import React from 'react';
import EmailComponent from '@/emails/components/EmailComponent';
import CardWrapper from '@/emails/components/wrappers/CardWrapper';
import { Item, P } from '@/emails/components/common';

export default class UserActivationEmail extends EmailComponent {
  renderHtml() {
    const user = this.props.data.user;

    return (
      <CardWrapper {...this.props}>
        <P>
          Use the following code to activate your account and verify your email
          address.
        </P>
        <Item className="h3">
          Activation Code:{' '}
          <span className="text-primary">{user.activation_code}</span>
        </Item>
        <P>This code will expire in 4 hours.</P>
      </CardWrapper>
    );
  }
}
