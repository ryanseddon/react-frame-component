import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import { expect } from 'chai';
import sinon from 'sinon/pkg/sinon';
import ForwardedRefFrame, { Frame } from '../src/Frame';

describe('The Frame Component', () => {
  let div;

  afterEach(() => {
    if (div) {
      div.remove();
      div = null;
    }
  });

  it('should create an empty iFrame', () => {
    const frame = ReactTestUtils.renderIntoDocument(<Frame />);
    expect(frame.props.children).to.be.undefined;
    expect(ReactDOM.findDOMNode(frame).contentWindow).to.be.defined;
  });

  it('should not pass this.props.children in iframe render', () => {
    sinon.spy(React, 'createElement');
    const frame = ReactTestUtils.renderIntoDocument(
      <Frame className="foo">
        <div />
      </Frame>
    );

    expect(React.createElement.calledWith('iframe', null));
    expect(frame.props.children).to.be.defined;
  });

  it('should create an empty iFrame and apply inline styles', () => {
    const frame = ReactTestUtils.renderIntoDocument(
      <Frame style={{ border: 0 }} />
    );
    expect(frame.props.style).to.deep.equal({ border: 0 });
    expect(ReactDOM.findDOMNode(frame).style.border).to.contain('0');
  });

  it('should pass along all props to underlying iFrame', () => {
    const frame = ReactTestUtils.renderIntoDocument(
      <Frame
        className="test-class-1 test-class-2"
        frameBorder={0}
        height="100%"
        width="80%"
      />
    );
    const node = ReactDOM.findDOMNode(frame);
    expect(frame.props.className).to.equal('test-class-1 test-class-2');
    expect(frame.props.frameBorder).to.equal(0);
    expect(frame.props.height).to.equal('100%');
    expect(frame.props.width).to.equal('80%');
    expect(node.className).to.equal('test-class-1 test-class-2');
    expect(node.getAttribute('frameBorder')).to.equal('0');
    expect(node.getAttribute('height')).to.equal('100%');
    expect(node.getAttribute('width')).to.equal('80%');
  });

  it('should call onLoad given as props', done => {
    div = document.body.appendChild(document.createElement('div'));

    const onLoad = () => {
      done();
    };

    ReactDOM.render(<Frame id="foo" onLoad={onLoad} />, div);
  });

  it('should create an iFrame with a <link> tag inside', done => {
    div = document.body.appendChild(document.createElement('div'));
    const frame = ReactDOM.render(
      <Frame
        head={<link href="styles.css" />}
        contentDidMount={() => {
          const head = ReactDOM.findDOMNode(frame).contentDocument.head;
          expect(head.querySelector('link')).to.be.defined;
          expect(head.querySelector('link').href).to.contain('styles.css');
          done();
        }}
      />,
      div
    );
  });

  it('should create an iFrame with a <script> and insert children', done => {
    div = document.body.appendChild(document.createElement('div'));
    const frame = ReactDOM.render(
      <Frame
        head={<script src="foo.js" />}
        contentDidMount={() => {
          const head = ReactDOM.findDOMNode(frame).contentDocument.head;
          const body = ReactDOM.findDOMNode(frame).contentDocument.body;

          expect(head.querySelector('script')).to.be.defined;
          expect(head.querySelector('script').src).to.contain('foo.js');
          expect(frame.props.children).to.be.defined;
          expect(body.querySelectorAll('h1,h2').length).to.equal(2);
          done();
        }}
      >
        <h1>Hello</h1>
        <h2>World</h2>
      </Frame>,
      div
    );
  });

  it('should create an iFrame with multiple <link> and <script> tags inside', done => {
    div = document.body.appendChild(document.createElement('div'));
    const frame = ReactDOM.render(
      <Frame
        head={[
          <link key="styles" href="styles.css" />,
          <link key="foo" href="foo.css" />,
          <script key="bar" src="bar.js" />
        ]}
        contentDidMount={() => {
          const head = ReactDOM.findDOMNode(frame).contentDocument.head;

          expect(head.querySelectorAll('link').length).to.equal(2);
          expect(head.querySelectorAll('script').length).to.equal(
            1,
            'expected 1 script tag'
          );
          done();
        }}
      />,
      div
    );
  });

  it('should encapsulate styles and not effect elements outside', done => {
    div = document.body.appendChild(document.createElement('div'));
    const component = ReactDOM.render(
      <div>
        <p>Some text</p>
        <Frame
          head={<style>{'*{color:red}'}</style>}
          contentDidMount={() => {
            const elem = ReactDOM.findDOMNode(component);
            const body = elem.querySelector('iframe').contentDocument.body;
            const getColour = e =>
              window.getComputedStyle(e, null).getPropertyValue('color');
            expect(getColour(elem.querySelector('p'))).to.equal('rgb(0, 0, 0)');
            expect(getColour(body.querySelector('p'))).to.equal(
              'rgb(255, 0, 0)'
            );
            done();
          }}
        >
          <p>Some text</p>
        </Frame>
      </div>,
      div
    );
  });

  it('should re-render inside the iframe correctly', done => {
    div = document.body.appendChild(document.createElement('div'));

    class Parent extends React.Component {
      constructor() {
        super();
        this.pRef = React.createRef();
        this.state = { text: 'Test 1' };
      }

      handleTest = () => {
        const p1 = this.pRef.current;
        expect(p1.textContent).to.equal('Test 1');
        p1.setAttribute('data-test-value', 'set on dom');

        this.setState({ text: 'Test 2' }, () => {
          const p2 = this.pRef.current;
          expect(p2.textContent).to.equal('Test 2');
          expect(p2.getAttribute('data-test-value')).to.equal('set on dom');
          done();
        });
      };

      render() {
        return (
          <Frame contentDidMount={this.handleTest}>
            <p ref={this.pRef}>{this.state.text}</p>
          </Frame>
        );
      }
    }

    ReactDOM.render(<Parent />, div);
  });

  it('should pass context to components in the frame', done => {
    div = document.body.appendChild(document.createElement('div'));

    class Parent extends React.Component {
      static childContextTypes = {
        color: PropTypes.string
      };

      static propTypes = {
        children: PropTypes.element.isRequired
      };

      getChildContext() {
        return { color: 'purple' };
      }

      render() {
        return <div>{this.props.children}</div>;
      }
    }

    const Child = (props, context) => (
      <div className="childDiv">{context.color}</div>
    );
    Child.contextTypes = {
      color: PropTypes.string.isRequired
    };

    ReactDOM.render(
      <Parent>
        <Frame
          contentDidMount={() => {
            const frame = div.querySelector('iframe');
            expect(frame).to.not.be.null;
            expect(
              frame.contentDocument.body.querySelector('.childDiv').innerHTML
            ).to.equal('purple');
            done();
          }}
        >
          <Child />
        </Frame>
      </Parent>,
      div
    );
  });

  it('should allow setting initialContent', done => {
    div = document.body.appendChild(document.createElement('div'));

    const initialContent =
      '<!DOCTYPE html><html><head><script>console.log("foo");</script></head><body><div></div></body></html>';
    const renderedContent =
      '<html><head><script>console.log("foo");</script></head><body><div><div class="frame-content"></div></div></body></html>';
    const frame = ReactDOM.render(
      <Frame
        initialContent={initialContent}
        contentDidMount={() => {
          const doc = ReactDOM.findDOMNode(frame).contentDocument;
          expect(doc.documentElement.outerHTML).to.equal(renderedContent);
          done();
        }}
      />,
      div
    );
  });

  it('should allow setting mountTarget', done => {
    div = document.body.appendChild(document.createElement('div'));

    const initialContent =
      "<!DOCTYPE html><html><head></head><body><h1>i was here first</h1><div id='mountHere'></div></body></html>";
    const frame = ReactDOM.render(
      <Frame
        initialContent={initialContent}
        mountTarget="#mountHere"
        contentDidMount={() => {
          const doc = ReactDOM.findDOMNode(frame).contentDocument;
          expect(doc.querySelectorAll('h1').length).to.equal(2);
          done();
        }}
      >
        <h1>And i am joining you</h1>
      </Frame>,
      div
    );
  });

  it('should call contentDidMount on initial render', done => {
    div = document.body.appendChild(document.createElement('div'));

    const didUpdate = sinon.spy();
    const didMount = sinon.spy(() => {
      expect(didMount.callCount).to.equal(1, 'expected 1 didMount');
      expect(didUpdate.callCount).to.equal(0, 'expected 0 didUpdate');
      done();
    });
    ReactDOM.render(
      <Frame contentDidMount={didMount} contentDidUpdate={didUpdate} />,
      div
    );
  });

  it('should call contentDidUpdate on subsequent updates', done => {
    div = document.body.appendChild(document.createElement('div'));
    const didUpdate = sinon.spy();
    const didMount = sinon.spy();
    const frame = ReactDOM.render(
      <Frame
        contentDidUpdate={didUpdate}
        contentDidMount={() => {
          didMount();
          frame.setState({ foo: 'bar' }, () => {
            expect(didMount.callCount).to.equal(1, 'expected 1 didMount');
            expect(didUpdate.callCount).to.equal(1, 'expected 1 didUpdate');
            frame.setState({ foo: 'gah' }, () => {
              expect(didMount.callCount).to.equal(1, 'expected 1 didMount');
              expect(didUpdate.callCount).to.equal(2, 'expected 2 didUpdate');
              done();
            });
          });
        }}
      />,
      div
    );
  });

  it('should return first child element of the `body` on call to `this.getMountTarget()` if `props.mountTarget` was not passed in', () => {
    div = document.body.appendChild(document.createElement('div'));

    const frame = ReactDOM.render(<Frame />, div);
    const body = ReactDOM.findDOMNode(frame).contentDocument.body;

    expect(Frame.prototype.getMountTarget.call(frame)).to.equal(
      body.children[0]
    );
  });

  it('should return resolved `props.mountTarget` node on call to `this.getMountTarget()` if `props.mountTarget` was passed in', () => {
    div = document.body.appendChild(document.createElement('div'));
    const initialContent =
      "<!DOCTYPE html><html><head></head><body><div></div><div id='container'></div></body></html>";

    const frame = ReactDOM.render(
      <Frame initialContent={initialContent} mountTarget="#container" />,
      div
    );
    const body = ReactDOM.findDOMNode(frame).contentDocument.body;
    div = document.body.appendChild(document.createElement('div'));

    expect(Frame.prototype.getMountTarget.call(frame)).to.equal(
      body.querySelector('#container')
    );
  });

  it('should not error when parent components are reused', done => {
    div = document.body.appendChild(document.createElement('div'));

    class Parent extends React.Component {
      constructor() {
        super();
        this.ulRef = React.createRef();
        this.loaded = 0;
        this.state = {
          p1: 'Test 1',
          p2: 'Test 2'
        };
      }

      handleTest = () => {
        // wait for both Frames to load
        this.loaded = this.loaded + 1;
        if (this.loaded !== 2) {
          return;
        }

        const iframes1 = this.ulRef.current.querySelectorAll('iframe');
        expect(
          iframes1[0].contentDocument.body.querySelector('p').textContent
        ).to.equal('Test 1');
        expect(
          iframes1[1].contentDocument.body.querySelector('p').textContent
        ).to.equal('Test 2');

        this.setState(
          {
            p1: 'Test 2',
            p2: 'Test 1'
          },
          () => {
            const iframes2 = this.ulRef.current.querySelectorAll('iframe');
            expect(
              iframes2[0].contentDocument.body.querySelector('p').textContent
            ).to.equal('Test 2');
            expect(
              iframes1[1].contentDocument.body.querySelector('p').textContent
            ).to.equal('Test 1');
            done();
          }
        );
      };

      render() {
        return (
          <ul className="container" ref={this.ulRef}>
            <li>
              <Frame contentDidMount={this.handleTest}>
                <p>{this.state.p1}</p>
              </Frame>
            </li>
            <li>
              <Frame contentDidMount={this.handleTest}>
                <p>{this.state.p2}</p>
              </Frame>
            </li>
          </ul>
        );
      }
    }

    ReactDOM.render(<Parent />, div);
  });

  it('should not error when the root component is removed', () => {
    div = document.body.appendChild(document.createElement('div'));
    ReactDOM.render(<Frame />, div);
    div.remove();
    ReactDOM.render(<Frame />, div);
  });

  it('should not error when root component is re-appended', done => {
    div = document.body.appendChild(document.createElement('div'));
    ReactDOM.render(<Frame />, div);
    ReactDOM.render(
      <Frame
        contentDidMount={() => {
          const iframes = ReactDOM.findDOMNode(div).querySelectorAll('iframe');

          expect(iframes[0].contentDocument.body.children.length).to.equal(1);
          expect(iframes[0].contentDocument.body.children.length).to.equal(1);
          done();
        }}
      />,
      div
    );
  });

  it('should properly assign ref prop', done => {
    div = document.body.appendChild(document.createElement('div'));

    const ref = sinon.spy(iframe => {
      expect(iframe instanceof HTMLIFrameElement).to.equal(true);
      done();
    });

    ReactDOM.render(<ForwardedRefFrame ref={ref} />, div);
  });
});
