import React from 'react';
import { PageWrapper } from '@/components/admin';
import Accounts from '@/components/account/Accounts';
import Examples from './examples/Examples';

export function Records() {
  return (
    <PageWrapper title="Getting Started" subTitle="Records">
      <Accounts showLabel={true} />
      <Examples showLabel={true} />
    </PageWrapper>
  );
}

export default Records;
