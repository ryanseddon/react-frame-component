import { createContext } from 'react';

type FrameContextValue = {
  document?: Document;
  window?: Window;
};

const defaultValue: FrameContextValue = {
  document: undefined,
  window: undefined
};

export const FrameContext = createContext<FrameContextValue>(defaultValue);
