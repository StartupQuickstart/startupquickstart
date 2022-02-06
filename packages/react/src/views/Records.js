import React from 'react';
import { PageWrapper } from '@/components/admin';
import Examples from './examples/Examples';

export function Records() {
  return (
    <PageWrapper title="Getting Started" subTitle="Records">
      <Examples
        showLabel={true}
        parent={{
          type: 'seating-configurations',
          id: 'dd0768ee-80d3-4a30-a5eb-1103371ad565'
        }}
      />
    </PageWrapper>
  );
}

export default Records;
