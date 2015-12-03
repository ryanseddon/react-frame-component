(function() {
  "use strict";

  var ReactTestUtils, div,
      React = require('react/addons'),
      Frame = require('../index.js');

  describe("Frame test",function(){
    beforeEach(function() {
      ReactTestUtils = React.addons.TestUtils;
    });

    afterEach(function() {
      if(div) {
        div.parentNode.removeChild(div);
        div = null;
      }
    });

    it("should create an empty iFrame", function () {
      var frame = ReactTestUtils.renderIntoDocument(<Frame />);
      expect(frame.props.children).toBeUndefined();
      expect(frame.getDOMNode().contentWindow).toBeDefined();
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
      expect(frame.getDOMNode().style.border).toContain('0');
    });

    it("should pass along all props to underlying iFrame", function () {
      var frame = ReactTestUtils.renderIntoDocument(
        <Frame className="test-class-1 test-class-2"
          frameBorder={0}
          height="100%"
          width="80%" />
      );
      var node = frame.getDOMNode();
      expect(frame.props.className).toEqual('test-class-1 test-class-2');
      expect(frame.props.frameBorder).toEqual(0);
      expect(frame.props.height).toEqual('100%');
      expect(frame.props.width).toEqual('80%');
      expect(node.className).toEqual('test-class-1 test-class-2');
      expect(node.getAttribute('frameBorder')).toEqual('0');
      expect(node.getAttribute('height')).toEqual('100%');
      expect(node.getAttribute('width')).toEqual('80%');
    });

    describe('cross-browser compatible', function() {
      it("should create an iFrame with a <link> tag inside", function () {
        div = document.body.appendChild(document.createElement('div'));
        var frame = React.render(<Frame head={
              <link href='styles.css' />
            } />, div),
            doc = frame.getDOMNode().contentDocument,
            readyState = doc.readyState,
            expectations = function() {
              var body = frame.getDOMNode().contentDocument.body;

              expect(body.querySelector('link')).toBeDefined();
              expect(body.querySelector('link').href).toContain('styles.css');
            };

        if (readyState && readyState === 'complete') {
          expectations();
        } else {
          setTimeout(expectations, 0);
        } 
      });

      it("should create an iFrame with a <script> and insert children", function () {
        div = document.body.appendChild(document.createElement('div'));
        var frame = React.render(<Frame head={
              <script src="foo.js"></script>
            }>
              <h1>Hello</h1>
              <h2>World</h2>
            </Frame>, div),
            doc = frame.getDOMNode().contentDocument,
            readyState = doc.readyState,
            expectations = function() {
              var body = doc.body;
              expect(body.querySelector('script')).toBeDefined();
              expect(body.querySelector('script').src).toContain('foo.js');
              expect(frame.props.children).toBeDefined();
              expect(body.querySelectorAll('h1,h2').length).toEqual(2);
            };

        if (readyState && readyState === 'complete') {
          expectations();
        } else {
          setTimeout(expectations, 0);
        } 
      });

      it("should create an iFrame with multiple <link> and <script> tags inside", function () {
        div = document.body.appendChild(document.createElement('div'));
        var frame = React.render(<Frame head={[
              <link key='styles' href='styles.css' />,
              <link key='foo' href='foo.css' />,
              <script key='bar' src='bar.js' />
            ]} />, div),
            doc = frame.getDOMNode().contentDocument,
            readyState = doc.readyState,
            expectations = function() {
              var body = doc.body;
              expect(body.querySelectorAll('link').length).toEqual(2);
              expect(body.querySelectorAll('script').length).toEqual(1);
            };

        if (readyState && readyState === 'complete') {
          expectations();
        } else {
          setTimeout(expectations, 0);
        } 
      });

      it("should encapsulate styles and not effect elements outside", function () {
        div = document.body.appendChild(document.createElement('div'));
        var component = React.render(<div>
              <p>Some text</p>
              <Frame head={
                <style>{'*{color:red}'}</style>
              }>
                <p>Some text</p>
              </Frame>
            </div>, div),
            frame = component.getDOMNode().querySelector('iframe'), 
            doc = frame.contentDocument,
            readyState = doc.readyState,
            expectations = function() {
              var body = doc.body,
                elem = component.getDOMNode(),
                body = doc.body,
                getColour = function(elem) {
                  return window.getComputedStyle(elem, null).getPropertyValue('color');
                };
              expect(getColour(elem.querySelector('p'))).toEqual('rgb(0, 0, 0)');
              expect(getColour(body.querySelector('p'))).toEqual('rgb(255, 0, 0)');
            }

        if (readyState && readyState === 'complete') {
          expectations();
        } else {
          setTimeout(expectations, 0);
        } 
      });
    });
  });
})();
