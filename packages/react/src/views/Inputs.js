import React, { useState } from 'react';
import { PageWrapper } from '@/components/admin';
import { RecordInput } from '@/components/records';
import { Row, Col, Card } from 'react-bootstrap';
import { RichText } from '@/components';

export function Inputs() {
  const [richText, setRichText] = useState('Rich Text');

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
    },
    {
      column: {
        label: 'Select Input',
        type: {
          type: 'STRING',
          enum: ['option 1', 'option 2', { value: '', label: 'Option 0' }]
        }
      },
      value: ''
    },
    {
      column: {
        label: 'Rich Text',
        type: {
          type: 'RICHTEXT'
        }
      },
      value: richText,
      onChange: setRichText
    }
  ];

  return (
    <PageWrapper title="Getting Started" subTitle="Inputs">
      <Row>
        <Col md="12" lg="12">
          {inputs.map(({ column, value, onChange }, index) => (
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
                onChange={onChange || console.log}
              />
            </div>
          ))}
          <Card>
            <Card.Body>
              <RichText>{richText}</RichText>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </PageWrapper>
  );
}

export default Inputs;
