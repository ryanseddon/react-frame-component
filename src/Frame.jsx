import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import DocumentContext from './DocumentContext';
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
    initialContent: '<!DOCTYPE html><html><head></head><body><div class="frame-root"></div></body></html>'
  };

  constructor(props, context) {
    super(props, context);
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    this.forceUpdate();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getDoc() {
    return this.node.contentDocument; // eslint-disable-line
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
      return null;
    }

    const doc = this.getDoc();
    if (doc && doc.readyState === 'complete') {
      if (doc.querySelector('div') === null) {
        this._setInitialContent = false;
      }

      const contentDidMount = this.props.contentDidMount;
      const contentDidUpdate = this.props.contentDidUpdate;

      const win = doc.defaultView || doc.parentView;
      const initialRender = !this._setInitialContent;
      const contents = (
        <Content contentDidMount={contentDidMount} contentDidUpdate={contentDidUpdate}>
          <DocumentContext document={doc} window={win}>
            <div className="frame-content">
              {this.props.children}
            </div>
          </DocumentContext>
        </Content>
      );

      if (initialRender) {
        doc.open('text/html', 'replace');
        doc.write(this.props.initialContent);
        doc.close();
        this._setInitialContent = true;
      }

      const mountTarget = this.getMountTarget();

      return (
        <div>
          {ReactDOM.createPortal(this.props.head, this.getDoc().head)}
          {ReactDOM.createPortal(contents, mountTarget)}
        </div>
      );
    }

    setTimeout(this.renderFrameContents.bind(this), 0);
    return null;
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
      <iframe {...props} ref={node => (this.node = node)}>
        {this.renderFrameContents()}
      </iframe>
    );
  }
}
