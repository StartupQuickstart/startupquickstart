import React from 'react';
import { Form } from 'react-bootstrap';
import { RichTextEditor } from '@/components/editors/RichTextEditor';
import { MultiCheckbox, RecordTypeahead, SelectInput } from '../inputs';
import DateInput from '../inputs/DateInput';

export function RecordInput({ column, onChange, value, ...props }) {
  const columnType = column?.type;
  const type = columnType?.type;

  if (columnType?.related) {
    return (
      <RecordTypeahead
        onChange={(record) => onChange(record?.id)}
        recordType={columnType?.relatedPath}
        value={value}
        {...props}
      />
    );
  } else if (type === 'DATE') {
    return (
      <DateInput
        onChange={([date]) => onChange(date)}
        value={value}
        {...props}
      />
    );
  } else if (type === 'DATETIME') {
    return (
      <DateInput
        onChange={([date]) => onChange(date)}
        showTime={true}
        value={value}
        {...props}
      />
    );
  } else if (type === 'RICHTEXT') {
    return (
      <RichTextEditor onChange={onChange} defaultValue={value} {...props} />
    );
  } else if (columnType?.enum) {
    if (columnType?.multiple) {
      return (
        <MultiCheckbox
          onChange={onChange}
          options={columnType.enum}
          value={value}
          type="switch"
          {...props}
        />
      );
    } else {
      return (
        <SelectInput
          onChange={onChange}
          options={columnType.enum}
          value={value}
          {...props}
        />
      );
    }
  } else {
    return <Form.Control onChange={onChange} defaultValue={value} {...props} />;
  }
}

export default RecordInput;
