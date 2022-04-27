import React from 'react';
import { Loading } from '@/components';
import { withAuthenticationRequired } from '@auth0/auth0-react';

export function Private({ children }) {
  const Component = withAuthenticationRequired(() => <>{children}</>, {
    onRedirecting: () => <Loading />
  });

  return <Component />;
}

export default Private;
