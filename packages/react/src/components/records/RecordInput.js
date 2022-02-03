import React from 'react';
import { Form } from 'react-bootstrap';
import { RecordTypeahead } from '../inputs';
import DateInput from '../inputs/DateInput';

export function RecordInput({ column, onChange, ...props }) {
  if (column?.type?.related) {
    return (
      <RecordTypeahead
        onChange={(record) => onChange(record?.id)}
        recordType={column?.type?.relatedPath}
        {...props}
      />
    );
  } else if (column?.type?.type === 'DATE') {
    return <DateInput onChange={onChange} {...props} />;
  } else {
    return <Form.Control onChange={onChange} {...props} />;
  }
}

export default RecordInput;
