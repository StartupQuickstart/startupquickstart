import React, { useImperativeHandle, useState } from 'react';
import { useQuery } from 'react-query';
import ReactBootstrapTable from './ReactBootstrapTable';

export function ReactBootstrapTableRemote({ innerRef, ...props }) {
  const [query, setQuery] = useState({
    pageIndex: props.defaultPage - 1,
    pageSize: props.defaultPageSize,
    sortBy: props.defaultSortby,
    search: props.defaultSearch,
    selectedRowIds: props.defaultSelectedRowIds
  });

  useImperativeHandle(
    innerRef,
    () => ({
      fetchData: result.refetch
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const result = useQuery(
    ['ReactBootstrapTable', 'fetchData', query],
    () => {
      return props.fetchData(query);
    },
    {}
  );

  function fetchData(query) {
    setQuery(query);
  }

  const data = result?.data?.records || [];

  return (
    <ReactBootstrapTable
      {...props}
      data={data}
      count={result?.data?.totalRecords}
      fetchData={fetchData}
    />
  );
}

export default ReactBootstrapTableRemote;
