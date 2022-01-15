import React from 'react';

export default class MissingRecords extends React.Component {
  render() {
    const style = Object.assign(
      {
        maxWidth: '500px',
        width: '90%',
        margin: 'auto'
      },
      this.props.style || {}
    );

    const classNames = this.props.className ? this.props.className.split(' ') : [];

    if (
      !this.props.className ||
      (this.props.className.indexOf('py-') === -1 && this.props.className.indexOf('p-') === -1)
    ) {
      classNames.push('py-3');
    }

    const className = classNames.join(' ');

    return (
      <div className={className} style={style}>
        <div className="text-center">
          <h3>{this.props.title}</h3>
          <p className="lead">{this.props.description}</p>
        </div>
      </div>
    );
  }
}
