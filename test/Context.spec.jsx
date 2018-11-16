import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { expect } from 'chai';
import {
  FrameContextProvider,
  FrameContextConsumer,
  FrameContext
} from '../src/Context';

describe('The DocumentContext Component', () => {
  it('will establish context variables', done => {
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

  it('exports full context instance to allow accessing via Class.contextType', done => {
    const document = { foo: 1 };
    const window = { bar: 2 };

    class Child extends React.Component {
      componentDidMount() {
        const { document: doc, window: win } = this.context;
        expect(doc).to.deep.equal({ foo: 1 });
        expect(win).to.deep.equal({ bar: 2 });
        done();
      }
      render() {
        return null;
      }
    }
    Child.contextType = FrameContext;

    ReactTestUtils.renderIntoDocument(
      <FrameContextProvider value={{ document, window }}>
        <Child />
      </FrameContextProvider>
    );
  });
});
