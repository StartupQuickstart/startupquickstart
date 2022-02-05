import React from 'react';
import { Form } from 'react-bootstrap';
import { RecordTypeahead } from '../inputs';
import DateInput from '../inputs/DateInput';

export function RecordInput({ column, onChange, ...props }) {
  const columnType = column?.type;
  const type = columnType?.type;

  if (columnType?.related) {
    return (
      <RecordTypeahead
        onChange={(record) => onChange(record?.id)}
        recordType={columnType?.relatedPath}
        {...props}
      />
    );
  } else if (type === 'DATE') {
    return <DateInput onChange={onChange} {...props} />;
  } else if (type === 'DATETIME') {
    return <DateInput onChange={onChange} showTime={true} {...props} />;
  } else {
    return <Form.Control onChange={onChange} {...props} />;
  }
}

export default RecordInput;
