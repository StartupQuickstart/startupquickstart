import fs from 'fs';
import path from 'path';
import React from 'react';
import { Email } from './common';
import EmailComponent from './EmailComponent';
import AppContext from './AppContext.js';
import Config from '../../../config';

export default class EmailWrapper extends EmailComponent {
  renderHtml() {
    const data = this.props.data;

    const appStylesPath = path.resolve(__dirname, '../../../emails/dist/styles.css');
    const styles = fs.readFileSync(appStylesPath, 'utf-8');

    return (
      <AppContext.Provider value={{ data: this.props.data, renderAs: this.props.renderAs }}>
        <Email className="email" title={Config.name} headCSS={styles}>
          {this.props.children}
        </Email>
      </AppContext.Provider>
    );
  }
}
