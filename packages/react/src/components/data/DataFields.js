import { Col, Row } from 'react-bootstrap';
import DataField from './DataField';

export function DataFields({ fields }) {
  const columnOneFields = fields.slice(0, fields.length / 2);
  const columnTwoFields = fields.slice(fields.length / 2);

  return (
    <Row>
      <Col>
        <table>
          <tbody>
            {columnOneFields.map((field, index) => (
              <DataField key={index} label={field.label} value={field.value} />
            ))}
          </tbody>
        </table>
      </Col>
      <Col>
        <table>
          <tbody>
            {columnTwoFields.map((field, index) => (
              <DataField key={index} label={field.label} value={field.value} />
            ))}
          </tbody>
        </table>
      </Col>
    </Row>
  );
}

export default DataFields;
