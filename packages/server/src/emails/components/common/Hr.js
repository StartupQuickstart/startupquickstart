import React from 'react';
import Item from './Item';
import EmailComponent from '../EmailComponent';

export default class Hr extends EmailComponent {
  renderText() {
    return <>{this.props.children}</>;
  }

  renderHtml() {
    const props = { ...this.props };
    return (
      <Item>
        <table border="0" cellPadding="0" cellSpacing="0" width="100%">
          <tr>
            <td className="hr-pre">&nbsp;</td>
          </tr>
          <tr>
            <td className="hr">&nbsp;</td>
          </tr>
          <tr>
            <td className="hr-post">&nbsp;</td>
          </tr>
        </table>
      </Item>
    );
  }
}
