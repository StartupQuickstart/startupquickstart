import React, { useEffect } from 'react';
import { Error } from '@/views';
import { useAuth0 } from '@auth0/auth0-react';
import { Loading } from '@/components';

export function PrivateWithRole(requiredRoles) {
  return function Authenticator({ children }) {
    const { isAuthenticated, user, loginWithRedirect, isLoading } = useAuth0();

    useEffect(() => {
      if (!isAuthenticated && !isLoading) {
        loginWithRedirect();
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    requiredRoles = Array.isArray(requiredRoles)
      ? requiredRoles
      : [requiredRoles];
    if (!requiredRoles.some((role) => user?.roles?.includes(role))) {
      return <Error code="403" />;
    }

    if (isLoading) {
      return <Loading />;
    }

    return <>{children}</>;
  };
}

export default PrivateWithRole;
