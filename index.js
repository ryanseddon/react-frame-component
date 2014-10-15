var React = require('react');
var merge = require('react/lib/merge');

var Frame = React.createClass({
  propTypes: {
    style: React.PropTypes.object,
    head:  React.PropTypes.renderable
  },
  render: function() {
    return React.DOM.iframe(merge(this.props));
  },
  componentDidMount: function() {
    this.renderFrameContents();
  },
  renderFrameContents: function() {
    var doc = this.getDOMNode().contentDocument;
    if(doc && doc.readyState === 'complete') {
      var contents = React.DOM.div(null,
        this.props.head,
        this.props.children
      );

      React.renderComponent(contents, doc.body);
    } else {
       setTimeout(this.renderFrameContents, 0);
    }
  },
  componentDidUpdate: function() {
    this.renderFrameContents();
  },
  componentWillUnmount: function() {
    React.unmountComponentAtNode(this.getDOMNode().contentDocument.body);
  }
});

module.exports = Frame;

