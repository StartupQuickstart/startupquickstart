import React from 'react';
import PageHeader from './PageHeader';

export function PageWrapper({ title, breadcrumbs, children, ...props }) {
  return (
    <>
      <PageHeader
        {...props}
        title={title}
        breadcrumbs={[
          { name: 'Home', to: '/' },
          ...(breadcrumbs || []),
          { name: title, className: 'active' }
        ]}
      />
      {children}
    </>
  );
}

export default PageWrapper;
