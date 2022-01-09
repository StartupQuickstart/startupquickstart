import React from 'react';
import PageHeader from './PageHeader';

export default function PageWrapper(props) {
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
