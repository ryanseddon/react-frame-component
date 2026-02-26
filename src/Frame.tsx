import {
  CSSProperties,
  ReactNode,
  RefObject,
  createRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import { createPortal } from 'react-dom';
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

const DEFAULT_INITIAL_CONTENT =
  '<!DOCTYPE html><html><head></head><body><div class="frame-root"></div></body></html>';

function Frame(props: FrameProps) {
  const {
    head = null,
    children,
    mountTarget,
    contentDidMount = () => {},
    contentDidUpdate = () => {},
    initialContent = DEFAULT_INITIAL_CONTENT,
    nodeRef: externalRef
  } = props;

  const [iframeLoaded, setIframeLoaded] = useState(false);
  const internalRef = useRef<HTMLIFrameElement | null>(null);
  const nodeRef = externalRef || internalRef;
  const isMounted = useRef(false);
  const loadCheckInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const getDoc = (): Document | null => {
    return nodeRef.current ? nodeRef.current.contentDocument : null;
  };

  const getMountTarget = (): Element | null => {
    const doc = getDoc();
    if (!doc) return null;

    if (mountTarget) {
      return doc.querySelector(mountTarget);
    }
    return doc.body.children[0];
  };

  const handleLoad = () => {
    if (loadCheckInterval.current) {
      clearInterval(loadCheckInterval.current);
    }
    if (!iframeLoaded) {
      setIframeLoaded(true);
    }
  };

  useEffect(() => {
    isMounted.current = true;

    const doc = getDoc();

    if (doc && nodeRef.current?.contentWindow) {
      nodeRef.current.contentWindow.addEventListener(
        'DOMContentLoaded',
        handleLoad
      );
    }

    return () => {
      isMounted.current = false;

      if (nodeRef.current?.contentWindow) {
        nodeRef.current.contentWindow.removeEventListener(
          'DOMContentLoaded',
          handleLoad
        );
      }

      if (loadCheckInterval.current) {
        clearInterval(loadCheckInterval.current);
      }
    };
  }, []);

  const renderFrameContents = (): ReactNode => {
    if (!isMounted.current) {
      return null;
    }

    const doc = getDoc();

    if (!doc) {
      return null;
    }

    const contents = (
      <Content
        contentDidMount={contentDidMount}
        contentDidUpdate={contentDidUpdate}
      >
        <FrameContextProvider
          value={{ document: doc, window: doc.defaultView || window }}
        >
          <div className="frame-content">{children}</div>
        </FrameContextProvider>
      </Content>
    );

    const mountTarget = getMountTarget();

    if (!mountTarget) {
      return null;
    }

    return [createPortal(head, doc.head), createPortal(contents, mountTarget)];
  };

  const {
    head: _head,
    initialContent: _initialContent,
    mountTarget: _mountTarget,
    contentDidMount: _contentDidMount,
    contentDidUpdate: _contentDidUpdate,
    children: _children,
    nodeRef: _nodeRef,
    ...iframeProps
  } = props;

  return (
    <iframe
      {...iframeProps}
      ref={nodeRef}
      srcDoc={initialContent}
      onLoad={handleLoad}
    >
      {iframeLoaded && renderFrameContents()}
    </iframe>
  );
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
