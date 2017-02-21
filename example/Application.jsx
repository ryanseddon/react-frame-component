import React from 'react';
import Frame from '../src';

const Application = () => (
  <div>
    <h1>Outside Frame Text</h1>
    <Frame>
      <h1>Inside Frame Text</h1>
    </Frame>
  </div>
);

export default Application;
