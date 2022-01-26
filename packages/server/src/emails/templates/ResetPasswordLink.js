import React from 'react';
import EmailComponent from '@/emails/components/EmailComponent';
import CardWrapper from '@/emails/components/wrappers/CardWrapper';
import { Item, P, A } from '@/emails/components/common';
import config from '@/config';

export default class ResetPasswordLink extends EmailComponent {
  renderHtml() {
    const { link, email } = this.props.data;

    return (
      <CardWrapper {...this.props}>
        <P>
          Click <A href={link}>here</A> to reset your {config.app.name}{' '}
          password.
        </P>
        <P>
          This link will expire in 1 hour. If you don't use it by then, you can
          request another login link.
        </P>
      </CardWrapper>
    );
  }
}
