var React = require('react');
var ReactDOM = require('react-dom');
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
    var doc  = ReactDOM.findDOMNode(this).contentDocument;
    var root = document.createElement("div");
    doc.body.appendChild(root);
    if(doc && doc.readyState === 'complete') {
      var contents = React.createElement('div',
        undefined,
        this.props.head,
        this.props.children
      );
      ReactDOM.render(contents, doc.body.childNodes[0]);
    } else {
      setTimeout(this.renderFrameContents, 0);
    }
  },
  componentDidUpdate: function() {
    this.renderFrameContents();
  },
  componentWillUnmount: function() {
    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(this).contentDocument.body);
  }
});

module.exports = Frame;
