var React = require('react');
var assign = require('object.assign');

var Frame = React.createClass({
  propTypes: {
    style: React.PropTypes.object,
    head:  React.PropTypes.node
  },
  getInitialState: function() {
    return {
      markup: "javascript:'<!doctype html>" + React.renderToString(this.getContents()) + "'"
    };
  },
  render: function() {
    return React.createElement('iframe', assign({}, this.props, {src: this.state.markup}));
  },
  componentDidMount: function() {
    this.renderFrameContents();
  },
  renderFrameContents: function() {
    var doc = this.getDOMNode().contentDocument;
    if(doc && doc.readyState === 'complete') {
      React.render(this.getContents(), doc.documentElement.parentNode);
    } else {
      setTimeout(this.renderFrameContents, 0);
    }
  },
  getContents: function() {
    return (
      React.createElement('html', null,
        React.createElement('head', null, this.props.head),
        React.createElement('body', null, this.props.children)
      )
    );
  },
  componentDidUpdate: function() {
    this.renderFrameContents();
  },
  componentWillUnmount: function() {
    React.unmountComponentAtNode(this.getDOMNode().contentDocument.body);
  }
});


module.exports = Frame;
