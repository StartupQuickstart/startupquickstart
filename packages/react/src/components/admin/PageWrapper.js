import React from 'react';
import PageHeader from './PageHeader';

export function PageWrapper(props) {
  const breadcrumbs = props.breadcrumbs || [];

  return (
    <>
      <PageHeader
        title={props.title}
        subTitle={props.subTitle}
        status={props.status}
        breadcrumbs={[
          { name: 'Home', to: '/' },
          ...breadcrumbs,
          { name: props.title, className: 'active' }
        ]}
      />
      {props.children}
    </>
  );
}

export default PageWrapper;
