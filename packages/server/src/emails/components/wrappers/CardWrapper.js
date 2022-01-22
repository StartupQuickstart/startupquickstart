import React from 'react';
import EmailComponent from '../EmailComponent';
import EmailWrapper from '../EmailWrapper';
import { Card, CardBody } from '../card';
import { Header, Footer } from '../layout';

export default class CardWrapper extends EmailComponent {
  renderHtml() {
    return (
      <EmailWrapper {...this.props}>
        <Card>
          <Header />
          <CardBody>{this.props.children}</CardBody>
          <Footer />
        </Card>
      </EmailWrapper>
    );
  }
}
