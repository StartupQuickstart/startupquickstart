import React from 'react';
import { useConfig } from '../../context/providers';

export default function Footer() {
  const {
    config: { website, legalName, supportPage, privacyPolicy, termsOfService }
  } = useConfig();

  return (
    <footer className="footer">
      <div className="container-fluid">
        <div className="row text-muted">
          <div className="col-md-6 col-sm-12 text-center text-md-start">
            <p className="mb-0">
              <a
                href={website}
                className="text-muted"
                target="_blank"
                rel="noreferrer"
              >
                <strong>{legalName}</strong>
              </a>{' '}
              &copy;
            </p>
          </div>
          <div className="col-md-6 col-sm-12 text-center text-md-end">
            <ul className="list-inline">
              {supportPage && (
                <li className="list-inline-item">
                  <a
                    className="text-muted"
                    href={supportPage}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Support
                  </a>
                </li>
              )}
              {privacyPolicy && (
                <li className="list-inline-item">
                  <a
                    className="text-muted"
                    href={privacyPolicy}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Privacy Policy
                  </a>
                </li>
              )}
              {termsOfService && (
                <li className="list-inline-item">
                  <a
                    className="text-muted"
                    href={termsOfService}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Terms of Service
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
