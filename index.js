var React = require('react');
var assign = require('object-assign');

var Frame = React.createClass({
  propTypes: {
    style: React.PropTypes.object,
    head:  React.PropTypes.node
  },
  render: function() {
    // The iframe isn't ready so we drop children from props here. #12, #17
    return React.createElement('iframe', assign({}, this.props, {children: undefined}));
  },
  componentDidMount: function() {
    this.renderFrameContents();
  },
  renderFrameContents: function() {
    var doc = null;
    if (this.isMounted()) {
      doc = this.getDOMNode().contentDocument;
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
  },
  componentDidUpdate: function() {
    this.renderFrameContents();
  },
  componentWillUnmount: function() {
    var doc = React.findDOMNode(this).contentDocument;
    if (doc) {
      React.unmountComponentAtNode(doc.body);
    }
  }
});


module.exports = Frame;
