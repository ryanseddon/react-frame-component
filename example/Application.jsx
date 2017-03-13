import React, { PropTypes } from 'react';
import Frame from '../src';

const InnerFrame = (props, context) => {
  console.log('IFrame Window and Document: ', context.window, context.document);
  return (
    <h1>Inside Frame Text</h1>
  );
};
InnerFrame.contextTypes = {
  window: PropTypes.any,
  document: PropTypes.any
};

const Application = () => (
  <div>
    <h1>Outside Frame Text</h1>
    <Frame>
      <InnerFrame />
    </Frame>
  </div>
);

export default Application;
