declare module 'react-frame-component' {
  import * as React from 'react';

  export interface FrameComponentProps
    extends
      Omit<React.IframeHTMLAttributes<HTMLIFrameElement>, 'children'>,
      Omit<React.RefAttributes<HTMLIFrameElement>, 'children'> {
    head?: React.ReactNode | undefined;
    mountTarget?: string | undefined;
    initialContent?: string | undefined;
    /**
     * @deprecated Use `onMount` instead. Will be removed in a future major version.
     */
    contentDidMount?: (() => void) | undefined;
    /**
     * @deprecated Use `onUpdate` instead. Will be removed in a future major version.
     */
    contentDidUpdate?: (() => void) | undefined;
    /**
     * Called when the iframe content is first mounted and ready.
     */
    onMount?: (() => void) | undefined;
    /**
     * Called when the iframe content updates after the initial mount.
     */
    onUpdate?: (() => void) | undefined;
    children?: React.ReactNode;
    nodeRef?: React.RefObject<HTMLIFrameElement | null>;
  }

  const FrameComponent: React.ForwardRefExoticComponent<
    FrameComponentProps & React.RefAttributes<HTMLIFrameElement | null>
  >;
  export default FrameComponent;

  export function Frame(props: FrameComponentProps): React.ReactElement | null;

  export interface ContentProps {
    children?: React.ReactNode;
    /**
     * @deprecated Use `onMount` instead.
     */
    contentDidMount?: () => void;
    /**
     * @deprecated Use `onUpdate` instead.
     */
    contentDidUpdate?: () => void;
    /**
     * Called when the iframe content is first mounted.
     */
    onMount?: () => void;
    /**
     * Called when the iframe content updates.
     */
    onUpdate?: () => void;
  }

  export function Content(props: ContentProps): React.ReactElement | null;

  export interface FrameContextProps {
    document?: Document;
    window?: Window;
  }

  export const FrameContext: React.Context<FrameContextProps>;

  export const FrameContextProvider: React.Provider<FrameContextProps>;

  export const FrameContextConsumer: React.Consumer<FrameContextProps>;

  export function useFrame(): FrameContextProps;
}
