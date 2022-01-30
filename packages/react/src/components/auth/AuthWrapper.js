import React, { useEffect } from 'react';
import Copyright from './Copyright';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import { Logo } from '@/components/admin/Logo';
import { useAuth } from '@/context/providers';
import SetupProgress from './SetupProgress';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '@/context';

export default function AuthWrapper({
  children,
  isSubmitting,
  title,
  subTitle,
  heading,
  subheading,
  setupProgress,
  expectAuthenticated
}) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { logo } = useConfig();

  useEffect(() => {
    if (isAuthenticated && !expectAuthenticated) {
      navigate('/');
    } else if (!isAuthenticated && expectAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate, expectAuthenticated]);

  return (
    <div className="container d-flex flex-column">
      {isSubmitting && <LoadingOverlay />}
      <div className="row">
        <div className="col-sm-10 col-md-8 col-lg-7 mx-auto d-table h-100">
          <div className="d-table-cell">
            <div className="text-center mt-5 mb-3">
              <Logo />
            </div>

            {heading && subheading && (
              <div className="text-center mt-4">
                {heading && <h1 className="header-bold">{heading}</h1>}
                {subheading && (
                  <p className="lead mb-5" style={{ fontWeight: 500 }}>
                    {subheading}
                  </p>
                )}
              </div>
            )}

            <div className="row">
              <div
                className={classNames(
                  'col-xl-8',
                  !setupProgress && 'offset-xl-2',
                  'col-lg-12'
                )}
              >
                <div className="card">
                  <div className="card-body">
                    <div className="m-sm-2">
                      <h3 className="header-bold mb-3">{title}</h3>
                      <p>{subTitle}</p>
                      {children}
                    </div>
                  </div>
                </div>
              </div>
              {setupProgress && (
                <div className="col-xl-4 col-lg-12 ps-0 ps-xl-4 pt-4">
                  <SetupProgress {...setupProgress} />
                </div>
              )}
            </div>
          </div>
        </div>
        <Copyright />
      </div>
    </div>
  );
}

AuthWrapper.defaultProps = {
  expectAuthenticated: false
};
