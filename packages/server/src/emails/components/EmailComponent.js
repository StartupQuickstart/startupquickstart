import React from 'react';
import AppContext from './AppContext';

export default class EmailComponent extends React.Component {
  /**
   * Renders the html version of the email
   */
  renderHtml() {
    return <>{this.props.children}</>;
  }

  /**
   * Renders the text version of the component
   * Defaults to the html version.
   */
  renderText() {
    return this.renderHtml();
  }

  render() {
    let Component;
    let renderAs = this.props.renderAs;

    if (this.context) {
      this.data = this.context.data;
      renderAs = this.context.renderAs;
    }

    if (renderAs === 'text') {
      Component = this.props.htmlOnly ? '' : this.renderText();

      if (this.props.textLabel && !this.props.htmlOnly) {
        Component = (
          <>
            {this.props.textLabel}: {Component}
          </>
        );
      }
    } else {
      Component = this.props.textOnly ? '' : this.renderHtml();
    }

    return <>{Component}</>;
  }
}

EmailComponent.contextType = AppContext;
