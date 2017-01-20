import React, { Component, Children, PropTypes } from 'react'; // eslint-disable-line no-unused-vars

export default class DocumentContext extends Component {
  static propTypes = {
    document: PropTypes.object.isRequired,
    window: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired
  };

  static childContextTypes = {
    document: PropTypes.object.isRequired,
    window: PropTypes.object.isRequired
  };

  static displayName = 'DocumentContext';

  getChildContext() {
    return {
      document: this.props.document,
      window: this.props.window
    };
  }

  render() {
    return Children.only(this.props.children);
  }
}
