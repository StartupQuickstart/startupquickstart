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
      ref={ref}
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
          dataField: 'name',
          text: 'Name',
          headerStyle: { width: 'auto', textAlign: 'center' },
          style: { textAlign: 'center' }
        },
        {
          dataField: 'is_deactivated',
          text: 'Status',
          headerStyle: { width: 'auto', textAlign: 'center' },
          style: { textAlign: 'center' },
          formatter: (name, user) => {
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
          dataField: 'email',
          text: 'Email',
          headerStyle: { width: 'auto', textAlign: 'center' },
          style: { textAlign: 'center' }
        },
        {
          dataField: 'role',
          text: 'Role',
          headerStyle: { width: 'auto', textAlign: 'center' },
          style: { textAlign: 'center' },
          formatter: (role) => {
            return (
              <span className="badge rounded-pill bg-primary text-capitalize w-100 text-center">
                {role}
              </span>
            );
          }
        },
        {
          dataField: 'created_at',
          text: 'Created',
          headerStyle: { width: 'auto', textAlign: 'center' },
          style: { textAlign: 'center' },
          formatter: (createdAt, media) => {
            return <Moment format={'lll'}>{createdAt}</Moment>;
          }
        },
        {
          dataField: 'last_active_at',
          text: 'Last Active',
          headerStyle: { width: 'auto', textAlign: 'center' },
          style: { textAlign: 'center' },
          formatter: (lastActiveAt) => {
            return lastActiveAt ? (
              <Moment format={'lll'}>{lastActiveAt}</Moment>
            ) : (
              'Never'
            );
          }
        },
        {
          dataField: 'id',
          text: 'Actions',
          headerStyle: { width: 'auto', textAlign: 'center' },
          style: { textAlign: 'center' },
          formatter: (id, user) => {
            return (
              <DropdownButton
                id={id}
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
