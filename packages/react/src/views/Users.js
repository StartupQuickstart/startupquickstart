import React from 'react';
import { PageWrapper } from '@/components/admin';
import { Users as UsersTable } from '@/components';

export function Users() {
  return (
    <PageWrapper title="Users">
      <UsersTable />
    </PageWrapper>
  );
}

export default Users;
