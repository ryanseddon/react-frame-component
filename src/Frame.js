/** @jsx React.DOM */
var Frame = React.createClass({
  propTypes: {
    style: React.PropTypes.object,
    head:  React.PropTypes.object
  },
  render: function() {
    return this.transferPropsTo(<iframe />);
  },
  componentDidMount: function() {
    this.renderFrameContents();
  },
  renderFrameContents: function() {
    var doc = this.getDOMNode().contentDocument;
    if(doc && doc.readyState === 'complete') {
      var contents = (
        <div>
          {this.props.head}
          {this.props.children}
        </div>
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

