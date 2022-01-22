import React from 'react';
import classnames from 'classnames';
import EmailComponent from '../EmailComponent';

export default class Button extends EmailComponent {
  renderHtml() {
    const className = classnames('btn', this.props.className, `btn-${this.props.size || 'md'}`);
    return (
      <table border="0" cellPadding="0" cellSpacing="0" width="100%">
        <tbody>
          <tr>
            <td align="center" height="38" valign="middle" className={className}>
              <a className="btn-inner" href={this.props.href} target="_blank">
                {this.props.children}
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}
