import React, { useEffect } from 'react';
import { useAuth } from '../../context/providers';

export function Public({ children }) {
  const { checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}

export default Public;
