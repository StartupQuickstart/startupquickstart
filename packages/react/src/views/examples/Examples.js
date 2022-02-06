import { Records } from '@/components/records';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

export function Examples({
  showLabel = false,
  dataParams,
  parent,
  canCreate = true
}) {
  const recordsRef = useRef();
  const recordType = 'examples';

  return (
    <Records
      innerRef={recordsRef}
      recordType={recordType}
      parent={parent}
      pluralLabel="Examples"
      singularLabel="Example"
      showLabel={showLabel}
      classes="table-sm"
      canCreate={canCreate}
      dataParams={dataParams}
      columns={[
        {
          dataField: 'name',
          text: 'Name',
          sort: true,
          formatter: (name, record) => {
            return <Link to={`/examples/${record.id}`}>{name}</Link>;
          }
        },
        {
          dataField: '',
          isDummyField: true,
          align: 'right',
          headerAlign: 'right',
          text: 'Actions',
          formatter: (e, record) => {
            return <div></div>;
          }
        }
      ]}
    />
  );
}

export default Examples;
