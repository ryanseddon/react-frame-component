import { Children, ReactNode, useLayoutEffect, useRef } from 'react';

type ContentProps = {
  children?: ReactNode;
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
};

export default function Content({
  children,
  contentDidMount,
  contentDidUpdate,
  onMount,
  onUpdate
}: ContentProps) {
  const isMounted = useRef(false);

  useLayoutEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      contentDidMount?.();
      onMount?.();
    } else {
      contentDidUpdate?.();
      onUpdate?.();
    }
  });

  if (!children) return null;
  return Children.only(children);
}
