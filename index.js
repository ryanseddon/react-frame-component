import React from 'react';

export default class Frame extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.renderFrameContents = this.renderFrameContents.bind(this);
  }

  componentDidMount() {
    this.renderFrameContents();
  }

  componentDidUpdate() {
    this.renderFrameContents();
  }

  componentWillUnmount() {
    React.unmountComponentAtNode(React.findDOMNode(this).contentDocument.body);
  }

  renderFrameContents() {
    var doc = React.findDOMNode(this).contentDocument;
    if(doc && doc.readyState === 'complete') {
      var contents = React.createElement('div',
        undefined,
        this.props.head,
        this.props.children
      );

      React.render(contents, doc.body);
    } else {
      setTimeout(this.renderFrameContents, 0);
    }
  }

  render() {
    return (
      <iframe {...this.props} />
    );
  }

};

Frame.propTypes = {
  style: React.PropTypes.object,
  head:  React.PropTypes.node
};
