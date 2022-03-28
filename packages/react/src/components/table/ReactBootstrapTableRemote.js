import React, { useImperativeHandle, useState } from 'react';
import { useQuery } from 'react-query';
import ReactBootstrapTable from './ReactBootstrapTable';
import { Error } from '@/views';

export function ReactBootstrapTableRemote({
  id,
  innerRef,
  queryKeys,
  ...props
}) {
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
      fetchData: refetch
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const { data, error, refetch, loading } = useQuery(
    ['ReactBootstrapTable', 'fetchData', id, query, queryKeys],
    () => {
      return props.fetchData(query);
    },
    {
      retry: (retryCount, error) => {
        return (
          ![401, 403, 404].includes(error?.response?.status) && retryCount < 2
        );
      }
    }
  );

  function fetchData(query) {
    setQuery(query);
  }

  if ([401, 403, 404].includes(error?.response?.status)) {
    return (
      <Error
        code={error?.response?.status}
        message={error?.response?.data?.message || error?.response?.data}
      />
    );
  }

  return (
    <ReactBootstrapTable
      {...props}
      loading={loading}
      error={error}
      data={data?.records || []}
      count={data?.totalRecords}
      fetchData={fetchData}
    />
  );
}

export default ReactBootstrapTableRemote;
