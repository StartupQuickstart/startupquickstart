import React from 'react';
import EmailComponent from '@/emails/components/EmailComponent';
import CardWrapper from '@/emails/components/wrappers/CardWrapper';
import { Item, P, A } from '@/emails/components/common';
import config from '@/config';
import { PrimaryButton } from '../components/buttons';

export default class InviteUser extends EmailComponent {
  renderHtml() {
    const { link, email, createdBy, config, host } = this.props.data;

    return (
      <CardWrapper {...this.props}>
        <Item className="h3">
          Join {createdBy.first_name} {createdBy.last_name} in {config.name}
        </Item>
        <P>
          <PrimaryButton href={link}>Log in to {config.name}</PrimaryButton>
        </P>
        <P>
          This link will expire in 24 hours. If you need a new link,{' '}
          <a href={host + '/forgot-password'}>request a password reset</a>,
          follow the instructions and then{' '}
          <a href={host + '/login'}>log in here</a>.
        </P>
      </CardWrapper>
    );
  }
}
