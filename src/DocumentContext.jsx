import React, { Component, Children } from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';

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
