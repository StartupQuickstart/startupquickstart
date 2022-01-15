import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'context/providers';

export function PublicOnly({ children }) {
  const { isAuthenticated, checkAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [navigate, isAuthenticated]);

  return <>{children}</>;
}

export default PublicOnly;
