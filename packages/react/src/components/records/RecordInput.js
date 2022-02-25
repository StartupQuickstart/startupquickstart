import React from 'react';
import { Form } from 'react-bootstrap';
import { RichTextEditor } from '@/components/editors/RichTextEditor';
import { RecordTypeahead, SelectInput } from '../inputs';
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
    return <DateInput onChange={([date]) => onChange(date)} {...props} />;
  } else if (type === 'DATETIME') {
    return (
      <DateInput
        onChange={([date]) => onChange(date)}
        showTime={true}
        {...props}
      />
    );
  } else if (type === 'RICHTEXT') {
    return (
      <RichTextEditor
        onChange={onChange}
        defaultValue={props.value}
        {...props}
      />
    );
  } else if (columnType?.enum) {
    return (
      <SelectInput onChange={onChange} options={columnType.enum} {...props} />
    );
  } else {
    return <Form.Control onChange={onChange} {...props} />;
  }
}

export default RecordInput;
