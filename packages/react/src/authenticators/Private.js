import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useConfig, useSetup } from '@/context/providers';
import { Error } from '@/views';
import { PageLoading } from '@/components';
import { useStripe } from '@/hooks';

export function Private({ children, requiredRoles, requireSubscription }) {
  const { isAuthenticated, checkAuth, user } = useAuth();
  const { hasSetupItem } = useSetup();
  const { hasValidSubscription, isLoading } = useStripe();
  const { config } = useConfig();
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

  /**
   * Handles required roles
   */
  requiredRoles =
    Array.isArray(requiredRoles) || !requiredRoles
      ? requiredRoles
      : [requiredRoles];

  if (
    requiredRoles &&
    !requiredRoles.some(
      (role) => user?.roles?.includes(role) || user?.role === role
    )
  ) {
    return <Error code="403" />;
  }

  /**
   * Handles subscriptions
   */
  if (!isLoading && requireSubscription && config?.hasSubscriptions) {
    if (!hasValidSubscription) {
      navigate('/checkout');
      return <PageLoading />;
    }
  }

  return <>{children}</>;
}

export function PrivateWithProps(props) {
  return function Authenticator({ children }) {
    return <Private {...props}>{children}</Private>;
  };
}

export default Private;
