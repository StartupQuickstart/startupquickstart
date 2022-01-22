import React from 'react';
import moment from 'moment';
import EmailComponent from '../EmailComponent';

export default class Date extends EmailComponent {
  renderHtml() {
    return <>{moment(this.props.date).format(this.props.format)}</>;
  }
}
