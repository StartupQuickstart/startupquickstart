import { Records as RecordsComponent } from '@/components/records';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

export function Records({
  showLabel = false,
  dataParams,
  parent,
  canCreate = true
}) {
  const recordsRef = useRef();
  const recordType = 'users';

  return (
    <RecordsComponent
      innerRef={recordsRef}
      recordType={'users'}
      parent={parent}
      pluralLabel="Users"
      singularLabel="User"
      showLabel={showLabel}
      canCreate={true}
      dataParams={dataParams}
      columns={[
        {
          id: 'first_name',
          Header: 'First Name',
          sort: true,
          accessor: (record, index) => {
            return (
              <Link to={`/${recordType}/${record.id}`}>
                {record.first_name}
              </Link>
            );
          }
        },
        {
          id: 'last_name',
          Header: 'Last Name',
          sort: true,
          accessor: (record, index) => {
            return (
              <Link to={`/${recordType}/${record.id}`}>{record.last_name}</Link>
            );
          }
        },
        {
          id: 'actions',
          Header: 'Actions',
          disableSortBy: true,
          align: 'right',
          headerAlign: 'right',
          actions: ['view', 'update', 'delete']
        }
      ]}
    />
  );
}

export default Records;
