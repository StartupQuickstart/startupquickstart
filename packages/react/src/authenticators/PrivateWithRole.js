import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useSetup } from '@/context/providers';
import { Error } from '@/views';

export function PrivateWithRole(requiredRoles) {
  return function Authenticator({ children }) {
    const { isAuthenticated, checkAuth, user } = useAuth();
    const { hasSetupItem } = useSetup();
    const navigate = useNavigate();

    useEffect(() => {
      const isAuthenticated = checkAuth();

      if (
        isAuthenticated &&
        hasSetupItem('activate') &&
        user &&
        !user.is_activated
      ) {
        navigate('/activate');
      } else if (!isAuthenticated && isAuthenticated !== null) {
        navigate('/login');
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate, isAuthenticated, user?.is_activated]);

    requiredRoles = Array.isArray(requiredRoles)
      ? requiredRoles
      : [requiredRoles];
    if (!requiredRoles.some((role) => user?.roles?.includes(role))) {
      return <Error code="403" />;
    }

    return <>{children}</>;
  };
}

export default PrivateWithRole;
