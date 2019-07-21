import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { FrameContextProvider } from './Context';
import Content from './Content';

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
    initialContent:
      '<!DOCTYPE html><html><head></head><body><div class="frame-root"></div></body></html>'
  };

  constructor(props, context) {
    super(props, context);
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;

    const doc = this.getDoc();
    if (doc && doc.readyState === 'complete') {
      this.forceUpdate();
    } else {
      this.node.addEventListener('load', this.handleLoad);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;

    this.node.removeEventListener('load', this.handleLoad);
  }

  getDoc() {
    return this.node ? this.node.contentDocument : null; // eslint-disable-line
  }

  getMountTarget() {
    const doc = this.getDoc();
    if (this.props.mountTarget) {
      return doc.querySelector(this.props.mountTarget);
    }
    return doc.body.children[0];
  }

  handleLoad = () => {
    this.forceUpdate();
  };

  renderFrameContents() {
    if (!this._isMounted) {
      return null;
    }

    const doc = this.getDoc();

    if (!doc) {
      return null;
    }

    const contentDidMount = this.props.contentDidMount;
    const contentDidUpdate = this.props.contentDidUpdate;

    const win = doc.defaultView || doc.parentView;
    const initialRender = !this._setInitialContent;
    const contents = (
      <Content
        contentDidMount={contentDidMount}
        contentDidUpdate={contentDidUpdate}
      >
        <FrameContextProvider value={{ document: doc, window: win }}>
          <div className="frame-content">{this.props.children}</div>
        </FrameContextProvider>
      </Content>
    );

    if (initialRender) {
      doc.open('text/html', 'replace');
      doc.write(this.props.initialContent);
      doc.close();
      this._setInitialContent = true;
    }

    const mountTarget = this.getMountTarget();

    return [
      ReactDOM.createPortal(this.props.head, this.getDoc().head),
      ReactDOM.createPortal(contents, mountTarget)
    ];
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
    return (
      <iframe
        {...props}
        ref={node => {
          this.node = node;
        }}
      >
        {this.renderFrameContents()}
      </iframe>
    );
  }
}
