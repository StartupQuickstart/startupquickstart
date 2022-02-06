import { Records } from '@/components/records';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

export function Accounts({ showLabel = false, dataParams, relatedTo }) {
  const recordsRef = useRef();
  const recordType = 'accounts';

  return (
    <Records
      innerRef={recordsRef}
      recordType={recordType}
      relatedTo={relatedTo}
      pluralLabel="Accounts"
      singularLabel="Account"
      showLabel={showLabel}
      classes="table-sm"
      canCreate={false}
      dataParams={dataParams}
      columns={[
        {
          dataField: 'name',
          text: 'Name',
          sort: true,
          formatter: (name, record) => {
            return <Link to={`/accounts/${record.id}`}>{name}</Link>;
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

export default Accounts;
