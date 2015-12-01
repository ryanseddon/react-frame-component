"use strict";

var div,
    React = require('react'),
    ReactDOM = require('react-dom'),
    ReactTestUtils = require('react-addons-test-utils'),
    Frame = require('../index.js');

describe("Frame test",function(){
  afterEach(function() {
    if(div) {
      div.parentNode.removeChild(div);
      div = null;
    }
  });

  it("should create an empty iFrame", function () {
    var frame = ReactTestUtils.renderIntoDocument(<Frame />);
    expect(frame.props.children).toBeUndefined();
    expect(ReactDOM.findDOMNode(frame).contentWindow).toBeDefined();
  });

  it("should not pass this.props.children in iframe render", function () {
    spyOn(React, 'createElement').andCallThrough();
    var frame = ReactTestUtils.renderIntoDocument(
      <Frame className='foo'>
        <div />
      </Frame>
    );

    expect(React.createElement).toHaveBeenCalledWith('iframe',{
      children: undefined,
      className: 'foo'
    });
    expect(frame.props.children).toBeDefined();
  });

  it("should create an empty iFrame and apply inline styles", function () {
    var frame = ReactTestUtils.renderIntoDocument(<Frame style={{border:0}} />);
    expect(frame.props.style).toEqual({border:0});
    expect(ReactDOM.findDOMNode(frame).style.border).toContain('0');
  });

  it("should pass along all props to underlying iFrame", function () {
    var frame = ReactTestUtils.renderIntoDocument(
      <Frame className="test-class-1 test-class-2"
        frameBorder={0}
        height="100%"
        width="80%" />
    );
    var node = ReactDOM.findDOMNode(frame);
    expect(frame.props.className).toEqual('test-class-1 test-class-2');
    expect(frame.props.frameBorder).toEqual(0);
    expect(frame.props.height).toEqual('100%');
    expect(frame.props.width).toEqual('80%');
    expect(node.className).toEqual('test-class-1 test-class-2');
    expect(node.getAttribute('frameBorder')).toEqual('0');
    expect(node.getAttribute('height')).toEqual('100%');
    expect(node.getAttribute('width')).toEqual('80%');
  });

  it("should create an iFrame with a <link> tag inside", function () {
    div = document.body.appendChild(document.createElement('div'));
    var frame = ReactDOM.render(<Frame head={
          <link href='styles.css' />
        } />, div),
        body = ReactDOM.findDOMNode(frame).contentDocument.body;

    expect(body.querySelector('link')).toBeDefined();
    expect(body.querySelector('link').href).toContain('styles.css');
  });

  it("should create an iFrame with a <script> and insert children", function () {
    div = document.body.appendChild(document.createElement('div'));
    var frame = ReactDOM.render(<Frame head={
          <script src="foo.js"></script>
        }>
          <h1>Hello</h1>
          <h2>World</h2>
        </Frame>, div),
        body = ReactDOM.findDOMNode(frame).contentDocument.body;

    expect(body.querySelector('script')).toBeDefined();
    expect(body.querySelector('script').src).toContain('foo.js');
    expect(frame.props.children).toBeDefined();
    expect(body.querySelectorAll('h1,h2').length).toEqual(2);
  });

  it("should create an iFrame with multiple <link> and <script> tags inside", function () {
    div = document.body.appendChild(document.createElement('div'));
    var frame = ReactDOM.render(<Frame head={[
          <link key='styles' href='styles.css' />,
          <link key='foo' href='foo.css' />,
          <script key='bar' src='bar.js' />
        ]} />, div),
        body = ReactDOM.findDOMNode(frame).contentDocument.body;

    expect(body.querySelectorAll('link').length).toEqual(2);
    expect(body.querySelectorAll('script').length).toEqual(1);
  });

  it("should encapsulate styles and not effect elements outside", function () {
    div = document.body.appendChild(document.createElement('div'));
    var component = ReactDOM.render(<div>
          <p>Some text</p>
          <Frame head={
            <style>{'*{color:red}'}</style>
          }>
            <p>Some text</p>
          </Frame>
        </div>, div),
        elem = ReactDOM.findDOMNode(component),
        body = elem.querySelector('iframe').contentDocument.body,
        getColour = function(elem) {
          return window.getComputedStyle(elem, null).getPropertyValue('color');
        }

    expect(getColour(elem.querySelector('p'))).toEqual('rgb(0, 0, 0)');
    expect(getColour(body.querySelector('p'))).toEqual('rgb(255, 0, 0)');
  });
});
