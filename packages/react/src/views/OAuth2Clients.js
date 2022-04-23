import React from 'react';
import { PageWrapper } from '@/components/admin';
import { OAuth2Clients as OAuth2ClientsList } from '@/components/oauth2/OAuth2Clients';

export function OAuth2Clients() {
  return (
    <PageWrapper title="Getting Started" subTitle="OAuth2 Clients">
      <OAuth2ClientsList />
    </PageWrapper>
  );
}

export default OAuth2Clients;
