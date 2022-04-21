import React from 'react';
import { Form } from 'react-bootstrap';
import { RichTextEditor } from '@/components/editors/RichTextEditor';
import {
  MultiCheckbox,
  RecordTypeahead,
  SelectInput,
  LineSeperatedInput,
  DateInput
} from '../inputs';

export function RecordInput({ column, onChange, value, ...props }) {
  const columnType = column?.type;
  const type = columnType?.type;
  const _value = value !== undefined ? value : column?.default;

  if (columnType?.related) {
    return (
      <RecordTypeahead
        onChange={(record) => onChange(record?.id)}
        recordType={columnType?.relatedPath}
        value={_value}
        {...props}
      />
    );
  } else if (type === 'DATE') {
    return (
      <DateInput
        onChange={([date]) => onChange(date)}
        value={_value}
        {...props}
      />
    );
  } else if (type === 'DATETIME') {
    return (
      <DateInput
        onChange={([date]) => onChange(date)}
        showTime={true}
        value={_value}
        {...props}
      />
    );
  } else if (type === 'RICHTEXT') {
    return (
      <RichTextEditor onChange={onChange} defaultValue={_value} {...props} />
    );
  } else if (columnType?.enum) {
    if (columnType?.multiple) {
      return (
        <MultiCheckbox
          onChange={onChange}
          options={columnType.enum}
          value={_value}
          type="switch"
          {...props}
        />
      );
    } else {
      return (
        <SelectInput
          onChange={onChange}
          options={columnType.enum}
          value={_value}
          {...props}
        />
      );
    }
  } else if (columnType?.multiple && columnType.type === 'TEXT') {
    return <LineSeperatedInput onChange={onChange} value={_value} {...props} />;
  } else {
    return (
      <Form.Control onChange={onChange} defaultValue={_value} {...props} />
    );
  }
}

export default RecordInput;
