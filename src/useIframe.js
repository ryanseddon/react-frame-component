import { useContext, useEffect, useState, useReducer, useRef } from "react";

export default function useIframe({ mountTarget, initialContent }) {
  const iframeEl = useRef(null);
  const [state, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "SET_DOC":
          return {
            ...state,
            doc: action.doc
          };
        case "MOUNTED":
          return {
            ...state,
            mounted: true
          };
        case "FIRST_RENDER":
          return { ...state, firstRender: false };
        case "TARGET":
          return {
            ...state,
            target: action.target
          };
        default:
          return state;
      }
    },
    {
      doc: null,
      mounted: false,
      target: undefined,
      firstRender: true
    }
  );

  const { mounted, doc, firstRender } = state;

  useEffect(() => {
    dispatch({ type: "SET_DOC", doc: iframeEl.current.contentDocument });
    dispatch({ type: "MOUNTED" });

    if (!mounted) return;

    if (mountTarget) {
      dispatch({
        type: "TARGET",
        target: doc.querySelector(mountTarget)
      });
    } else {
      dispatch({ type: "TARGET", target: doc.body.children[0] });
    }

    if (firstRender) {
      doc.open("text/html", "replace");
      doc.write(initialContent);
      doc.close();
      dispatch({
        type: "FIRST_RENDER"
      });
    }
  }, [mounted, doc, firstRender]);

  return {
    ref: iframeEl,
    state
  };
}
