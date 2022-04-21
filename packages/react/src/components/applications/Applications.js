import { Records as RecordsComponent } from '@/components/records';
import { useRef } from 'react';
import { Secret } from '../common/Secret';

export function Applications({
  showLabel = false,
  dataParams,
  parent,
  canCreate = true
}) {
  const recordsRef = useRef();
  const recordType = 'oauth/clients';

  return (
    <RecordsComponent
      innerRef={recordsRef}
      recordType={recordType}
      parent={parent}
      pluralLabel="OAuth2 Clients"
      singularLabel="OAuth2 Client"
      showLabel={showLabel}
      canCreate={true}
      dataParams={dataParams}
      columns={[
        {
          accessor: 'name',
          Header: 'Name',
          sort: true
        },
        {
          accessor: 'id',
          Header: 'Client Id',
          sort: true
        },
        {
          id: 'client_secret',
          Header: 'Client Secret',
          sort: true,
          accessor: ({ client_secret }) => {
            return <Secret value={client_secret} />;
          }
        },
        {
          id: 'redirect_uris',
          Header: 'Redirect Uris',
          sort: true,
          accessor: ({ redirect_uris }) => {
            return redirect_uris.join(', ');
          }
        },
        {
          id: 'grants',
          Header: 'Grants',
          sort: true,
          accessor: ({ grants }) => {
            return grants.join(', ');
          }
        },
        {
          id: 'actions',
          Header: 'Actions',
          disableSortBy: true,
          align: 'right',
          headerAlign: 'right',
          actions: ['update', 'delete']
        }
      ]}
    />
  );
}

export default Applications;
