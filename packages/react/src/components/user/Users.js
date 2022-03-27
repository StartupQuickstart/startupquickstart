import React from 'react';
import Moment from 'react-moment';
import Records from '@/components/records/Records';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import User from '@/lib/startupquickstart-server/user';
import { useConfig } from '@/context/providers';

export function Users(props) {
  const ref = React.createRef();
  const { config } = useConfig();

  async function deactivate(user) {
    await User.deactivate(user);
    await ref.current.setData();
  }

  async function activate(user) {
    await User.activate(user);
    await ref.current.setData();
  }

  return (
    <Records
      innerRef={ref}
      recordType="users"
      singularLabel="User"
      pluralLabel="Users"
      canCreate={true}
      createForm={{
        heading: `Invite your teammate to ${config?.name || 'loading...'}`,
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
          id: 'role',
          Header: 'Role',
          headerStyle: {
            width: 'auto',
            textAlign: 'center',
            maxWidth: '50px'
          },
          style: { textAlign: 'center', maxWidth: '50px' },
          accessor: ({ role }) => {
            return (
              <span className="badge rounded-pill bg-primary text-capitalize w-100 text-center">
                {role}
              </span>
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
          accessor: (user) => {
            return (
              <DropdownButton
                id={user.id}
                title="Actions"
                variant={'white'}
                size={'sm'}
              >
                {!user.is_deactivated && (
                  <Dropdown.Item href="#" onClick={() => deactivate(user)}>
                    Deactivate
                  </Dropdown.Item>
                )}
                {user.is_deactivated && (
                  <Dropdown.Item href="#" onClick={() => activate(user)}>
                    Activate
                  </Dropdown.Item>
                )}
              </DropdownButton>
            );
          }
        }
      ]}
    />
  );
}

export default Users;
