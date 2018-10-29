import React from "react";
import { createPortal } from "react-dom";

import useIframe from "./useIframe";
import FrameContext from "./Context";

export default function Frame({
  initialContent = '<!DOCTYPE html><html><head></head><body><div class="frame-root"></div></body></html>',
  mountTarget,
  head,
  children,
  ...rest
}) {
  const {
    ref,
    state: { doc, target }
  } = useIframe({ mountTarget, initialContent });

  const renderContent = () => {
    if (target) {
      const contents = (
        <FrameContext.Provider
          value={{ document: doc, window: doc.defaultView }}
        >
          <div className="frame-content">{children}</div>
        </FrameContext.Provider>
      );

      return [createPortal(head, doc.head), createPortal(children, target)];
    }
  };

  return (
    <iframe {...rest} ref={ref}>
      {renderContent()}
    </iframe>
  );
}
