import React from 'react';
import { render } from '@testing-library/react';
import { expect, describe, it } from 'vitest';
import {
  FrameContextProvider,
  FrameContextConsumer,
  FrameContext,
  useFrame
} from '../src/Context';

describe('The DocumentContext Component', () => {
  it('will establish context variables', async () => {
    const document = { x: 1 };
    const window = { y: 2 };

    const Child = () => (
      <FrameContextConsumer>
        {({ document: doc, window: win }) => {
          expect(doc).toEqual(document);
          expect(win).toEqual(window);
          return <h1>{`x=${doc.x},y=${win.y}`}</h1>;
        }}
      </FrameContextConsumer>
    );

    render(
      <FrameContextProvider value={{ document, window }}>
        <Child />
      </FrameContextProvider>
    );
  });

  it('exports full context instance to allow accessing via Class.contextType', async () => {
    const document = { foo: 1 };
    const window = { bar: 2 };

    class Child extends React.Component {
      componentDidMount() {
        const { document: doc, window: win } = this.context;
        expect(doc).toEqual({ foo: 1 });
        expect(win).toEqual({ bar: 2 });
      }
      render() {
        return null;
      }
    }
    Child.contextType = FrameContext;

    render(
      <FrameContextProvider value={{ document, window }}>
        <Child />
      </FrameContextProvider>
    );
  });

  it('exports full context instance to allow accessing via custom hook', async () => {
    const document = { foo: 1 };
    const window = { bar: 2 };

    const Child = () => {
      useFrame();

      return (
        <FrameContextConsumer>
          {({ document: doc, window: win }) => {
            expect(doc).toEqual(document);
            expect(win).toEqual(window);
            return null;
          }}
        </FrameContextConsumer>
      );
    };

    render(
      <FrameContextProvider value={{ document, window }}>
        <Child />
      </FrameContextProvider>
    );
  });
});
