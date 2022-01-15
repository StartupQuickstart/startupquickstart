import React from 'react';
import NumberFormat from 'react-number-format';

export class Currency extends React.Component {
  render() {
    const value = parseFloat(this.props.children || 0);

    return (
      <NumberFormat
        value={value}
        displayType={'text'}
        thousandSeparator={true}
        prefix={'$'}
        decimalScale={
          this.props.decimals !== undefined ? this.props.decimals : 2
        }
        fixedDecimalScale={
          this.props.decimals !== undefined ? this.props.decimals : 2
        }
      />
    );
  }
}

export default Currency;
