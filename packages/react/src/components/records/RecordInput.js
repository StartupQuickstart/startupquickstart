import React from 'react';
import { Form } from 'react-bootstrap';
import { RichTextEditor } from '@/components/editors/RichTextEditor';
import { RecordTypeahead, SelectInput } from '../inputs';
import DateInput from '../inputs/DateInput';

export function RecordInput({
  column,
  onChange,
  value,
  defaultValue,
  ...props
}) {
  const columnType = column?.type;
  const type = columnType?.type;

  const valueProps = {};
  if (onChange) {
    valueProps.value = value || '';
    valueProps.onChange = onChange;
  } else {
    valueProps.defaultValue = defaultValue || value;
  }

  if (columnType?.related) {
    return (
      <RecordTypeahead
        onChange={(record) => onChange(record?.id)}
        recordType={columnType?.relatedPath}
        {...valueProps}
        {...props}
      />
    );
  } else if (type === 'DATE') {
    return (
      <DateInput
        onChange={([date]) => onChange(date)}
        {...props}
        {...valueProps}
      />
    );
  } else if (type === 'DATETIME') {
    return (
      <DateInput
        onChange={([date]) => onChange(date)}
        showTime={true}
        {...props}
        {...valueProps}
      />
    );
  } else if (type === 'RICHTEXT') {
    return (
      <RichTextEditor
        onChange={onChange}
        defaultValue={props.value}
        {...props}
        {...valueProps}
      />
    );
  } else if (columnType?.enum) {
    return (
      <SelectInput
        onChange={onChange}
        options={columnType.enum}
        {...props}
        {...valueProps}
      />
    );
  } else {
    return <Form.Control onChange={onChange} {...props} {...valueProps} />;
  }
}

export default RecordInput;
