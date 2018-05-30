import React from 'react';

export const {
  Provider: BrowserContextProvider,
  Consumer: BrowserContextConsumer
} = React.createContext({ document, window });
