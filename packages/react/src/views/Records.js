import React from 'react';
import { PageWrapper } from '@/components/admin';
import { Records as RecordsComponent } from '../components/examples/Records';

export function Records() {
  return (
    <PageWrapper title="Getting Started" subTitle="Records">
      <RecordsComponent showLabel={true} />
    </PageWrapper>
  );
}

export default Records;
