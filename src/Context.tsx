import React, { createContext, useContext, ReactNode } from 'react';

type FrameContextValue = {
  document?: Document;
  window?: Window;
};

const defaultValue: FrameContextValue = {
  document: undefined,
  window: undefined
};

export const FrameContext = createContext<FrameContextValue>(defaultValue);

export const useFrame = () => useContext(FrameContext);

export const FrameContextConsumer = FrameContext.Consumer;

export const FrameContextProvider = FrameContext.Provider;
