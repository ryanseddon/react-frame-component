import React, { Children, PropTypes } from 'react';

export default class DocumentContext extends React.Component {
  static propTypes = {
    document: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired,
  };

  static childContextTypes = {
    document: PropTypes.object.isRequired,
  };

  static displayName = 'DocumentContext';

  constructor(props, context) {
    super(props, context);
    this.document = props.document;
  }

  getChildContext() {
    const { document } = this.props;
    return { document };
  }

  render() {
    return Children.only(this.props.children);
  }
}
