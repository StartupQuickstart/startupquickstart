import React from 'react';
import PageHeader from './PageHeader';

export function PageWrapper({
  icon,
  iconColor,
  title,
  subTitle,
  status,
  breadcrumbs,
  children
}) {
  return (
    <>
      <PageHeader
        icon={icon}
        iconColor={iconColor}
        title={title}
        subTitle={subTitle}
        status={status}
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
