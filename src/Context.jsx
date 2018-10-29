import { createContext } from 'react';

let doc;
let win;
if (typeof document !== 'undefined') {
  doc = document;
}
if (typeof window !== 'undefined') {
  win = window;
}

export default createContext({ document: doc, window: win });
