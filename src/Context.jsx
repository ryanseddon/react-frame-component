import React from 'react';

let doc = undefined
let win = undefined
if (typeof document !== 'undefined') {
  doc = document
}
if (typeof window !== 'undefined') {
  win = window
}

export const {
  Provider: FrameContextProvider,
  Consumer: FrameContextConsumer
} = React.createContext({ document: doc, window: win });
