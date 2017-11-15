import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import DocumentContext from './DocumentContext';

const hasConsole = typeof window !== 'undefined' && window.console;
const noop = () => {};
let swallowInvalidHeadWarning = noop;
let resetWarnings = noop;

if (hasConsole) {
  const originalError = console.error; // eslint-disable-line no-console
  // Rendering a <head> into a body is technically invalid although it
  // works. We swallow React's validateDOMNesting warning if that is the
  // message to avoid confusion
  swallowInvalidHeadWarning = () => {
    console.error = (msg) => {  // eslint-disable-line no-console
      if (/<head>/.test(msg)) return;
      originalError.call(console, msg);
    };
  };
  resetWarnings = () => (console.error = originalError);  // eslint-disable-line no-console
}

export default class Frame extends Component {
  // React warns when you render directly into the body since browser extensions
  // also inject into the body and can mess up React. For this reason
  // initialContent is expected to have a div inside of the body
  // element that we render react into.
  static propTypes = {
    style: PropTypes.object, // eslint-disable-line
    head: PropTypes.node,
    initialContent: PropTypes.string,
    mountTarget: PropTypes.string,
    contentDidMount: PropTypes.func,
    contentDidUpdate: PropTypes.func,
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element)
    ])
  };

  static defaultProps = {
    style: {},
    head: null,
    children: undefined,
    mountTarget: undefined,
    contentDidMount: () => {},
    contentDidUpdate: () => {},
    initialContent: '<!DOCTYPE html><html><head></head><body><div class="frame-root"></div></body></html>'
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
    const mountTarget = this.getMountTarget();
    if (doc && mountTarget) {
      ReactDOM.unmountComponentAtNode(mountTarget);
    }
  }

  getDoc() {
    return ReactDOM.findDOMNode(this).contentDocument; // eslint-disable-line
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
    if (doc && doc.readyState === 'complete') {
      if (doc.querySelector('div') === null) {
        this._setInitialContent = false;
      }

      const win = doc.defaultView || doc.parentView;
      const initialRender = !this._setInitialContent;
      const contents = (
        <DocumentContext document={doc} window={win}>
          <div className="frame-content">
            {this.props.head}
            {this.props.children}
          </div>
        </DocumentContext>
      );

      if (initialRender) {
        doc.open('text/html', 'replace');
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
      setTimeout(this.renderFrameContents.bind(this), 0);
    }
  }

  render() {
    const props = {
      ...this.props,
      children: undefined // The iframe isn't ready so we drop children from props here. #12, #17
    };
    delete props.head;
    delete props.initialContent;
    delete props.mountTarget;
    delete props.contentDidMount;
    delete props.contentDidUpdate;
    return (<iframe {...props} />);
  }
}
