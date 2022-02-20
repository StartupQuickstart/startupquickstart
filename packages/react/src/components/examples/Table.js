import React from 'react';
import ReactBootstrapTableRemote from '@/components/table/ReactBootstrapTableRemote';

const { default: makeData } = require('./makeData');

export function Table() {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        columns: [
          {
            Header: 'First Name',
            accessor: 'firstName'
          },
          {
            Header: 'Last Name',
            accessor: 'lastName'
          }
        ]
      },
      {
        Header: 'Info',
        columns: [
          {
            Header: 'Age',
            accessor: 'age'
          },
          {
            Header: 'Visits',
            accessor: 'visits'
          },
          {
            Header: 'Status',
            accessor: 'status'
          },
          {
            Header: 'Profile Progress',
            accessor: 'progress'
          }
        ]
      }
    ],
    []
  );

  return (
    <div>
      <ReactBootstrapTableRemote
        columns={columns}
        pluralLabel={'Records'}
        fetchData={({ pageIndex, pageSize, search }) => {
          return { records: makeData(pageSize), totalRecords: 1000 };
        }}
      />
    </div>
  );
}

export default Table;
