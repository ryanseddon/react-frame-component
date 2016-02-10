var React = require('react');
var ReactDOM = require('react-dom');
var assign = require('object-assign');

var hasConsole = typeof window !== 'undefined' && window.console;
var noop = function() {}
var swallowInvalidHeadWarning = noop;
var resetWarnings = noop;

if(hasConsole) {
  var originalError = console.error;
  // Rendering a <head> into a body is technically invalid although it
  // works. We swallow React's validateDOMNesting warning if that is the
  // message to avoid confusion
  swallowInvalidHeadWarning = function() {
    console.error = function(msg) {
      if (/<head>/.test(msg)) return;
      originalError.call(console, msg);
    };
  };
  resetWarnings = function() {
    console.error = originalError;
  };
}

var Frame = React.createClass({
  // React warns when you render directly into the body since browser extensions
  // also inject into the body and can mess up React. For this reason
  // initialContent initialContent is expected to have a div inside of the body
  // element that we render react into.
  propTypes: {
    style: React.PropTypes.object,
    head:  React.PropTypes.node,
    initialContent:  React.PropTypes.string,
  },
  getDefaultProps: function() {
    return {
      initialContent: '<html><head></head><body><div></div></body></html>'
    };
  },
  render: function() {
    // The iframe isn't ready so we drop children from props here. #12, #17
    return React.createElement('iframe', assign({}, this.props, {children: undefined}));
  },
  componentDidMount: function() {
    this.renderFrameContents();
  },
  renderFrameContents: function() {
    var doc = ReactDOM.findDOMNode(this).contentDocument;
    if(doc && doc.readyState === 'complete') {
      var contents = React.createElement('div',
        undefined,
        this.props.head,
        this.props.children
      );

      if (!this._setInitialContent) {
        doc.clear();
        doc.open();
        doc.write(this.props.initialContent);
        doc.close();
        this._setInitialContent = true;
      }

      swallowInvalidHeadWarning();
      // unstable_renderSubtreeIntoContainer allows us to pass this component as
      // the parent, which exposes context to any child components.
      ReactDOM.unstable_renderSubtreeIntoContainer(this, contents, doc.body.children[0]);
      resetWarnings();
    } else {
      setTimeout(this.renderFrameContents, 0);
    }
  },
  componentDidUpdate: function() {
    this.renderFrameContents();
  },
  componentWillUnmount: function() {
    var doc = ReactDOM.findDOMNode(this).contentDocument;
    if (doc) {
      ReactDOM.unmountComponentAtNode(doc.body);
    }
  }
});

module.exports = Frame;

