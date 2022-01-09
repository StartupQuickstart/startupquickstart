import React, { useEffect } from 'react';
import PageLoading from '../../components/common/PageLoading';
import { useAuth } from '../../context/providers';

export function Logout() {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  return <PageLoading />;
}

export default Logout;
