import React from 'react';
import EmailComponent from '../EmailComponent';

export default class Capitalize extends EmailComponent {
  /**
   * Capitalizes the first child of the component.
   * Assumes there is only 1 child of type string
   */
  capitalize() {
    let word = this.props.children;

    if (!word) {
      return word;
    }

    word = word[0].toUpperCase() + word.slice(1).toLowerCase();
    return word;
  }

  renderHtml() {
    return this.capitalize();
  }
}
