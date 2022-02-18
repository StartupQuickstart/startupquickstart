import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useSetup } from '@/context/providers';

export function Private({ children }) {
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

  return <>{children}</>;
}

export default Private;
