import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import { expect } from 'chai';
import {
  BrowserContextProvider,
  BrowserContextConsumer
} from '../src/Context';

describe('The DocumentContext Component', () => {
  it('will establish context variables', (done) => {
    const document = { x: 1 };
    const window = { y: 2 };

    const Child = () => (
      <BrowserContextConsumer>
        {({ document: doc, window: win }) => {
          expect(doc).to.equal(document);
          expect(win).to.equal(window);
          done();
          return <h1>{`x=${doc.x},y=${win.y}`}</h1>;
        }}
      </BrowserContextConsumer>
    );
    ReactTestUtils.renderIntoDocument(
      <BrowserContextProvider value={{ document, window }}>
        <Child />
      </BrowserContextProvider>
    );
  });
});
