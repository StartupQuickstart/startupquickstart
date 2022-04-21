import React from 'react';
import { PageWrapper } from '@/components/admin';
import { Applications as ApplicationsList } from '@/components/applications/Applications';

export function Applications() {
  return (
    <PageWrapper title="Getting Started" subTitle="Applications">
      <ApplicationsList />
    </PageWrapper>
  );
}

export default Applications;
