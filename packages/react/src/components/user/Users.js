import React from 'react';
import Moment from 'react-moment';
import Records from '@/components/records/Records';
import { useConfig, useApi } from '@/context/providers';
import { CheckCircle, Send, XCircle } from 'react-feather';
import { RecordAction } from '../records';

export function Users(props) {
  const { Api } = useApi();
  const ref = React.createRef();
  const { config } = useConfig();

  async function activate(user) {
    await Api.get('users').activate(user);
    await ref.current.fetchData();
  }

  async function deactivate(user) {
    await Api.get('users').deactivate(user);
    await ref.current.fetchData();
  }

  async function sendInvite(user) {
    await Api.get('users').sendInviteEmail(user);
  }

  return (
    <Records
      innerRef={ref}
      recordType="users"
      singularLabel="User"
      pluralLabel="Users"
      canCreate={true}
      createForm={{
        heading: `Invite your teammate ${
          config?.name ? `to ${config.name}` : ''
        }`,
        subheading:
          'Send them a friendly invitation with everything they need to get started.',
        saveBtnLabel: 'Invite'
      }}
      columns={[
        {
          accessor: 'name',
          Header: 'Name',
          headerStyle: { width: 'auto', textAlign: 'center' },
          style: { textAlign: 'center' }
        },
        {
          id: 'is_deactivated',
          Header: 'Status',
          headerStyle: {
            width: 'auto',
            textAlign: 'center',
            maxWidth: '50px'
          },
          style: { textAlign: 'center', maxWidth: '50px' },
          accessor: (user) => {
            return (
              <>
                {user.invite_pending && !user.is_deactivated && (
                  <span className="badge rounded-pill bg-warning w-100 text-center">
                    Invite Pending
                  </span>
                )}
                {user.is_deactivated && (
                  <span className="badge rounded-pill bg-danger w-100 text-center">
                    Deactivated
                  </span>
                )}
                {!user.invite_pending && !user.is_deactivated && (
                  <span className="badge rounded-pill bg-success w-100 text-center">
                    Active
                  </span>
                )}
              </>
            );
          }
        },
        {
          accessor: 'email',
          Header: 'Email',
          headerStyle: { width: 'auto', textAlign: 'center' },
          style: { textAlign: 'center' }
        },
        {
          id: 'roles',
          Header: 'Roles',
          headerStyle: {
            width: 'auto',
            textAlign: 'center',
            maxWidth: '50px'
          },
          style: { textAlign: 'center', maxWidth: '50px' },
          accessor: ({ roles }) => {
            return (
              <>
                {roles.map((role) => (
                  <span className="badge rounded-pill bg-primary text-capitalize w-100 text-center">
                    {role.split('_').join(' ')}
                  </span>
                ))}
              </>
            );
          }
        },
        {
          id: 'created_at',
          Header: 'Created',
          headerStyle: { width: 'auto', textAlign: 'center' },
          style: { textAlign: 'center' },
          accessor: ({ created_at }) => {
            return <Moment format={'lll'}>{created_at}</Moment>;
          }
        },
        {
          id: 'last_active_at',
          Header: 'Last Active',
          headerStyle: { width: 'auto', textAlign: 'center' },
          style: { textAlign: 'center' },
          accessor: ({ last_active_at }) => {
            return last_active_at ? (
              <Moment format={'lll'}>{last_active_at}</Moment>
            ) : (
              'Never'
            );
          }
        },
        {
          id: 'id',
          Header: 'Actions',
          headerStyle: { width: 'auto', textAlign: 'center' },
          style: { textAlign: 'center' },
          actions: ['update'],
          accessor: (user) => {
            return (
              <>
                {!user.is_deactivated && (
                  <RecordAction
                    onClick={() => deactivate(user)}
                    tooltip="Deactivate"
                    asText={true}
                  >
                    <XCircle />
                  </RecordAction>
                )}
                {user.is_deactivated && (
                  <RecordAction
                    onClick={() => activate(user)}
                    tooltip="Activate"
                    asText={true}
                  >
                    <CheckCircle />
                  </RecordAction>
                )}
                {!user.is_deactivated && user.invite_pending && (
                  <RecordAction
                    onClick={() => sendInvite(user)}
                    tooltip="Resend Invite Email"
                    asText={true}
                  >
                    <Send />
                  </RecordAction>
                )}
              </>
            );
          }
        }
      ]}
    />
  );
}

export default Users;
