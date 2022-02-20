import React from 'react';
import { PageWrapper } from '@/components/admin';
import { RecordInput } from '@/components/records';
import { Row, Col } from 'react-bootstrap';

export function Inputs() {
  const inputs = [
    {
      column: { label: 'Text Input', type: { type: 'TEXT' } },
      value: 'Sample Text'
    },
    {
      column: { label: 'Date Input', type: { type: 'DATE' } },
      value: new Date()
    },
    {
      column: { label: 'Date/Time Input', type: { type: 'DATETIME' } },
      value: new Date()
    }
  ];

  return (
    <PageWrapper title="Getting Started" subTitle="Inputs">
      <Row>
        <Col md="12" lg="6">
          {inputs.map(({ column, value }, index) => (
            <div className="form-group" key={index}>
              <label className="form-label">
                {column.label}{' '}
                {column.required && <span className="text-danger">*</span>}
              </label>
              <RecordInput
                column={column}
                id={column.name}
                name={column.name}
                className="form-control form-control-lg"
                placeholder={column.label}
                value={value}
                required={column.required}
              />
            </div>
          ))}
        </Col>
      </Row>
    </PageWrapper>
  );
}

export default Inputs;
