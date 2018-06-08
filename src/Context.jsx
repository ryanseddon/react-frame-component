import React from 'react';

export const {
  Provider: FrameContextProvider,
  Consumer: FrameContextConsumer
} = React.createContext({ document, window });
