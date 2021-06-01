import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { expect } from 'chai';
import sinon from 'sinon/pkg/sinon';
import Content from '../src/Content';

describe('The Content component', () => {
  it('should render children', () => {
    const content = ReactTestUtils.renderIntoDocument(
      <Content
        contentDidMount={() => null}
        contentDidUpdate={() => null}
        contentWillUnmount={() => null}
      >
        <div className="test-class-1" />
      </Content>
    );

    const div = ReactTestUtils.findRenderedDOMComponentWithTag(content, 'div');
    expect(div.className).to.equal('test-class-1');
  });

  it('should call contentDidMount on initial render', () => {
    const didMount = sinon.spy();
    const didUpdate = sinon.spy();

    ReactTestUtils.renderIntoDocument(
      <Content contentDidMount={didMount} contentDidUpdate={didUpdate}>
        <div className="test-class-1" />
      </Content>
    );

    expect(didMount.callCount).to.equal(1);
    expect(didUpdate.callCount).to.equal(0);
  });

  it('should call contentDidUpdate on subsequent updates', done => {
    const didMount = sinon.spy();
    const didUpdate = sinon.spy();

    const content = ReactTestUtils.renderIntoDocument(
      <Content contentDidMount={didMount} contentDidUpdate={didUpdate}>
        <div className="test-class-1" />
      </Content>
    );

    expect(didUpdate.callCount).to.equal(0);

    content.setState({ foo: 'bar' }, () => {
      expect(didMount.callCount).to.equal(1);
      expect(didUpdate.callCount).to.equal(1);

      content.setState({ foo: 'gah' }, () => {
        expect(didMount.callCount).to.equal(1);
        expect(didUpdate.callCount).to.equal(2);

        done();
      });
    });
  });

  it('should call contentWillUnmount before unmounting', done => {
    const didMount = sinon.spy();
    const didUpdate = sinon.spy();
    const willUnmount = sinon.spy();

    class Parent extends React.Component {
      state = {
        isClosed: false
      };

      render() {
        if (!this.state.isClosed) {
          return (
            <Content
              contentDidMount={didMount}
              contentDidUpdate={didUpdate}
              contentWillUnmount={willUnmount}
            >
              <div className="test-class-1" />
            </Content>
          );
        }
        return null;
      }
    }

    const wrapper = ReactTestUtils.renderIntoDocument(<Parent />);

    expect(didMount.callCount).to.equal(1);
    expect(didUpdate.callCount).to.equal(0);
    wrapper.setState({ isClosed: true }, () => {
      expect(willUnmount.callCount).to.equal(1);
      done();
    });
  });

  it('should error if null is passed in contentWillUnmount', () => {
    ReactTestUtils.renderIntoDocument(
      <Content
        contentDidMount={() => null}
        contentDidUpdate={() => null}
        contentWillUnmount={null}
      >
        <div className="test-class-1" />
      </Content>
    );
  });

  it('should not error if contentWillUnmount is not passed as a prop', () => {
    ReactTestUtils.renderIntoDocument(
      <Content contentDidMount={() => null} contentDidUpdate={() => null}>
        <div className="test-class-1" />
      </Content>
    );
  });
});
