import {
  Component,
  CSSProperties,
  ForwardRefRenderFunction,
  ReactNode,
  RefObject,
  createRef,
  forwardRef,
  useImperativeHandle,
  useRef
} from 'react';
import ReactDOM from 'react-dom';
import { FrameContextProvider } from './Context';
import Content from './Content';

export type FrameProps = {
  style?: CSSProperties;
  head?: ReactNode;
  initialContent?: string;
  mountTarget?: string;
  contentDidMount?: () => void;
  contentDidUpdate?: () => void;
  children?: ReactNode;
  nodeRef?: RefObject<HTMLIFrameElement | null>;
};

type FrameState = {
  iframeLoaded: boolean;
};

class Frame extends Component<FrameProps, FrameState> {
  static defaultProps = {
    style: {} as CSSProperties,
    head: null as ReactNode,
    children: undefined as ReactNode,
    mountTarget: undefined as string | undefined,
    contentDidMount: () => {},
    contentDidUpdate: () => {},
    initialContent:
      '<!DOCTYPE html><html><head></head><body><div class="frame-root"></div></body></html>'
  };

  private _isMounted = false;
  private nodeRef: RefObject<HTMLIFrameElement | null>;
  private loadCheckInterval: ReturnType<typeof setInterval> | undefined;

  constructor(props: FrameProps) {
    super(props);
    this._isMounted = false;
    this.nodeRef = props.nodeRef || createRef<HTMLIFrameElement | null>();
    this.state = { iframeLoaded: false };
  }

  componentDidMount() {
    this._isMounted = true;

    const doc = this.getDoc();

    if (doc && this.nodeRef.current?.contentWindow) {
      this.nodeRef.current.contentWindow.addEventListener(
        'DOMContentLoaded',
        this.handleLoad
      );
    }
  }

  componentWillUnmount() {
    this._isMounted = false;

    if (this.nodeRef.current?.contentWindow) {
      this.nodeRef.current.contentWindow.removeEventListener(
        'DOMContentLoaded',
        this.handleLoad
      );
    }

    if (this.loadCheckInterval) {
      clearInterval(this.loadCheckInterval);
    }
  }

  getDoc(): Document | null {
    return this.nodeRef.current ? this.nodeRef.current.contentDocument : null;
  }

  getMountTarget(): Element | null {
    const doc = this.getDoc();
    if (!doc) return null;

    if (this.props.mountTarget) {
      return doc.querySelector(this.props.mountTarget);
    }
    return doc.body.children[0];
  }

  setRef = (node: HTMLIFrameElement | null) => {
    this.nodeRef.current = node;
  };

  handleLoad = () => {
    if (this.loadCheckInterval) {
      clearInterval(this.loadCheckInterval);
    }
    if (!this.state.iframeLoaded) {
      this.setState({ iframeLoaded: true });
    }
  };

  startLoadCheck = () => {
    this.loadCheckInterval = setInterval(() => {
      this.handleLoad();
    }, 500);
  };

  renderFrameContents(): ReactNode {
    if (!this._isMounted) {
      return null;
    }

    const doc = this.getDoc();

    if (!doc) {
      return null;
    }

    const mountFunc = () => {};
    const contents = (
      <Content
        contentDidMount={this.props.contentDidMount ?? mountFunc}
        contentDidUpdate={this.props.contentDidUpdate ?? mountFunc}
      >
        <FrameContextProvider
          value={{ document: doc, window: doc.defaultView || window }}
        >
          <div className="frame-content">{this.props.children}</div>
        </FrameContextProvider>
      </Content>
    );

    const mountTarget = this.getMountTarget();

    if (!mountTarget) {
      return null;
    }

    return [
      ReactDOM.createPortal(this.props.head, this.getDoc()!.head),
      ReactDOM.createPortal(contents, mountTarget)
    ];
  }

  render() {
    const {
      head,
      initialContent,
      mountTarget,
      contentDidMount,
      contentDidUpdate,
      children,
      ...iframeProps
    } = this.props;

    return (
      <iframe
        {...iframeProps}
        ref={this.setRef}
        srcDoc={initialContent}
        onLoad={this.handleLoad}
      >
        {this.state.iframeLoaded && this.renderFrameContents()}
      </iframe>
    );
  }
}

const FrameWithRef = forwardRef<
  HTMLIFrameElement | null,
  Omit<FrameProps, 'children'>
>((props, ref) => {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  useImperativeHandle(ref, () => frameRef.current as HTMLIFrameElement);
  return <Frame {...props} children={undefined} nodeRef={frameRef as any} />;
});

export default FrameWithRef;
export { Frame };
