import { Form } from 'react-bootstrap';
import { RecordTypeahead } from '../inputs';
import DateInput from '../inputs/DateInput';

export function RecordInput({ column, ...props }) {
  if (column?.type?.related) {
    return (
      <RecordTypeahead recordType={column?.type?.relatedPath} {...props} />
    );
  } else if (column?.type?.type === 'DATE') {
    return <DateInput {...props} />;
  } else {
    return <Form.Control {...props} />;
  }
}

export default RecordInput;
