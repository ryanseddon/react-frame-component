import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { expect } from 'chai';
import {
  FrameContextProvider,
  FrameContextConsumer
} from '../src/Context';

describe('The DocumentContext Component', () => {
  it('will establish context variables', (done) => {
    const document = { x: 1 };
    const window = { y: 2 };

    const Child = () => (
      <FrameContextConsumer>
        {({ document: doc, window: win }) => {
          expect(doc).to.equal(document);
          expect(win).to.equal(window);
          done();
          return <h1>{`x=${doc.x},y=${win.y}`}</h1>;
        }}
      </FrameContextConsumer>
    );
    ReactTestUtils.renderIntoDocument(
      <FrameContextProvider value={{ document, window }}>
        <Child />
      </FrameContextProvider>
    );
  });
});
