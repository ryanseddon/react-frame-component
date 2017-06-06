import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ReactTestUtils from 'react-dom/test-utils';
import { expect } from 'chai';
import DocumentContext from '../src/DocumentContext';

describe('The DocumentContext Component', () => {
  it('will establish context variables', () => {
    const Child = (props, context) => {
      const { x } = context.document;
      const { y } = context.window;
      return (<h1>{`x=${x},y=${y}`}</h1>);
    };
    Child.contextTypes = {
      window: PropTypes.object.isRequired,
      document: PropTypes.object.isRequired
    };
    const rendered = ReactTestUtils.renderIntoDocument(
      <DocumentContext document={{ x: 1 }} window={{ y: 2 }}>
        <Child />
      </DocumentContext>,
    );
    const domNode = ReactDOM.findDOMNode(rendered);
    expect(domNode.innerHTML).to.equal('x=1,y=2');
  });
});
