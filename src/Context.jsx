import React from 'react';

let doc;
let win;
if (typeof document !== 'undefined') {
  doc = document;
}
if (typeof window !== 'undefined') {
  win = window;
}

export const FrameContext = React.createContext({ document: doc, window: win });

export const {
  Provider: FrameContextProvider,
  Consumer: FrameContextConsumer
} = FrameContext;
