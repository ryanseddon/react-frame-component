import React from 'react';
import ReactDOM from 'react-dom';
import DocumentContext from './DocumentContext';

const hasConsole = typeof window !== 'undefined' && window.console;
const noop = function() {}
let swallowInvalidHeadWarning = noop;
let resetWarnings = noop;

if (hasConsole) {
  const originalError = console.error;
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

export default class Frame extends React.Component {
  // React warns when you render directly into the body since browser extensions
  // also inject into the body and can mess up React. For this reason
  // initialContent initialContent is expected to have a div inside of the body
  // element that we render react into.
  static propTypes = {
    style: React.PropTypes.object,
    head:  React.PropTypes.node,
    initialContent:  React.PropTypes.string,
    mountTarget:  React.PropTypes.string,
    contentDidMount:  React.PropTypes.func,
    contentDidUpdate:  React.PropTypes.func
  };

  static displayname = 'Frame';

  static defaultProps = {
    initialContent: '<!DOCTYPE html><html><head></head><body><div class="frame-root"></div></body></html>',
  };

  constructor(props, context) {
    super(props, context);
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    this.renderFrameContents();
  }

  componentDidUpdate() {
    this.renderFrameContents();
  }

  componentWillUnmount() {
    this._isMounted = false;
    const doc = this.getDoc();
    if (doc) {
      ReactDOM.unmountComponentAtNode(this.getMountTarget());
    }
  }

  getDoc() {
    return ReactDOM.findDOMNode(this).contentDocument;
  }

  getMountTarget() {
    const doc = this.getDoc();
    if (this.props.mountTarget) {
      return doc.querySelector(this.props.mountTarget);
    }
    return doc.body.children[0];
  }

  renderFrameContents() {
    if (!this._isMounted) {
      return;
    }

    const doc = this.getDoc();
    if(doc && doc.readyState === 'complete') {
      const contents = (
        <DocumentContext document={doc}>
          <div className="frame-content">
            {this.props.head}
            {this.props.children}
          </div>
        </DocumentContext>
      );

      const initialRender = !this._setInitialContent;
      if (!this._setInitialContent) {
        doc.open();
        doc.write(this.props.initialContent);
        doc.close();
        this._setInitialContent = true;
      }

      swallowInvalidHeadWarning();

      // unstable_renderSubtreeIntoContainer allows us to pass this component as
      // the parent, which exposes context to any child components.
      const callback = initialRender ? this.props.contentDidMount : this.props.contentDidUpdate;
      const mountTarget = this.getMountTarget();

      ReactDOM.unstable_renderSubtreeIntoContainer(this, contents, mountTarget, callback);
      resetWarnings();
    } else {
      setTimeout(this.renderFrameContents, 0);
    }
  }

  render() {
    const props = { ... this.props };
    delete props.head;
    delete props.initialContent;
    delete props.mountTarget;
    delete props.contentDidMount;
    delete props.contentDidUpdate;

    // The iframe isn't ready so we drop children from props here. #12, #17
    return (<iframe {...props} children={undefined} />);
  }
}
