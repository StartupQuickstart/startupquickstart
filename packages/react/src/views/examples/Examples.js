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

  return (
    <Records
      innerRef={recordsRef}
      recordType={'seats'}
      parent={parent}
      pluralLabel="Seats"
      singularLabel="Seat"
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
          dataField: 'venue.name',
          text: 'Venue',
          align: 'center',
          headerAlign: 'center',
          sort: true,
          formatter: (name, record) => {
            return <Link to={`/venues/${record.venue_id}`}>{name}</Link>;
          }
        },
        {
          dataField: 'floor_code',
          text: 'Floor',
          align: 'center',
          headerAlign: 'center',
          sort: true
        },
        {
          dataField: 'section_code',
          text: 'Section',
          align: 'center',
          headerAlign: 'center',
          sort: true
        },
        {
          dataField: 'row_code',
          text: 'Row',
          align: 'center',
          headerAlign: 'center',
          sort: true
        },
        {
          dataField: 'seat_code',
          text: 'Seat',
          align: 'center',
          headerAlign: 'center',
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

export default Examples;
