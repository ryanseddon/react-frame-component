import React, { createContext, useContext, ReactNode } from 'react';

interface FrameContextValue {
  document: Document;
  window: Window;
}

const defaultDoc =
  typeof document !== 'undefined' ? document : ({} as Document);
const defaultWin = typeof window !== 'undefined' ? window : ({} as Window);

export const FrameContext = createContext<FrameContextValue>({
  document: defaultDoc,
  window: defaultWin
});

export const useFrame = () => useContext(FrameContext);

export const FrameContextConsumer = FrameContext.Consumer;

export const FrameContextProvider = FrameContext.Provider;
