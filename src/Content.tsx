import { Children, ReactNode, useLayoutEffect, useRef } from 'react';

type ContentProps = {
  children?: ReactNode;
  contentDidMount?: () => void;
  contentDidUpdate?: () => void;
};

export default function Content({
  children,
  contentDidMount,
  contentDidUpdate
}: ContentProps) {
  const isMounted = useRef(false);

  useLayoutEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      contentDidMount?.();
    } else {
      contentDidUpdate?.();
    }
  });

  if (!children) return null;
  return Children.only(children);
}
