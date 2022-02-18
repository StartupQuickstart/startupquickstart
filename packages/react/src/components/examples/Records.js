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

  return (
    <RecordsComponent
      innerRef={recordsRef}
      recordType={'records'}
      parent={parent}
      pluralLabel="Records"
      singularLabel="Record"
      showLabel={showLabel}
      classes="table-sm"
      canCreate={true}
      dataParams={dataParams}
      columns={[
        {
          dataField: 'name',
          text: 'Name',
          sort: true,
          formatter: (name, record) => {
            return <Link to={`/seats/${record.id}`}>{name}</Link>;
          }
        },
        {
          dataField: 'created_dt',
          text: 'Name',
          sort: true
        },
        {
          dataField: '',
          isDummyField: true,
          align: 'right',
          headerAlign: 'right',
          text: 'Actions',
          actions: ['view', 'update', 'delete']
        }
      ]}
    />
  );
}

export default Records;
