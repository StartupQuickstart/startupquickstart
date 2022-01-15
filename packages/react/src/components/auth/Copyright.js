import React from 'react';
import { useConfig } from 'context/providers';

export default function Copyright(props) {
  const {
    config: { legalName, website }
  } = useConfig();
  return (
    <div className="text-center mt-4">
      <small className="text-muted">
        <strong>
          &copy;{new Date().getFullYear()} <a href={website}>{legalName}</a> All
          rights reserved.
        </strong>
      </small>
    </div>
  );
}
