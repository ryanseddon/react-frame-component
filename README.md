# React &lt;Frame /> component

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]

This component allows you to encapsulate your entire React application or per component in an iFrame.

```bash
npm install --save react-frame-component
```

## How to use:

```js
import Frame from 'react-frame-component';
```

Go check out the [demo][demo-url].

```html
const Header = ({ children }) => (
  <Frame>
    <h1>{children}</h1>
  </Frame>
);

ReactDOM.render(<Header>Hello</Header>, document.body);
```

Or you can wrap it at the `render` call.

```html
ReactDOM.render(
  <Frame>
    <Header>Hello</Header>
  </Frame>,
  document.body
);
```

##### Props:

###### head
`head:  PropTypes.node`

The `head` prop is a dom node that gets inserted before the children of the frame. Note that this is injected into the body of frame (see the blog post for why). This has the benefit of being able to update and works for stylesheets.

###### initialContent
`initialContent:  PropTypes.string`

Defaults to `'<!DOCTYPE html><html><head></head><body><div></div></body></html>'`

The `initialContent` props is the initial html injected into frame. It is only injected once, but allows you to insert any html into the frame (e.g. a head tag, script tags, etc). Note that it does *not* update if you change the prop. Also at least one div is required in the body of the html, which we use to render the react dom into.

###### mountTarget
`mountTarget:  PropTypes.string`

The `mountTarget` props is a css selector (#target/.target) that specifies where in the `initialContent` of the iframe, children will be mounted.

```html
<Frame
  initialContent='<!DOCTYPE html><html><head></head><body><h1>i wont be changed</h1><div id="mountHere"></div></body></html>'
  mountTarget='#mountHere'
  >
</Frame>
```

###### contentDidMount and contentDidUpdate
`contentDidMount:  PropTypes.func`
`contentDidUpdate:  PropTypes.func`

`contentDidMount` and `contentDidUpdate` are conceptually equivalent to
`componentDidMount` and `componentDidUpdate`, respectively. The reason these are
needed is because internally we call `ReactDOM.render` which starts a new set of
lifecycle calls. This set of lifecycle calls are sometimes triggered after the
lifecycle of the parent component, so these callbacks provide a hook to know
when the frame contents are mounted and updated.

###### ref
`ref: PropTypes.oneOfType([ PropTypes.func, PropTypes.shape({ current: PropTypes.instanceOf(Element) }) ])`

The `ref` prop provides a way to access inner iframe DOM node. To utilitize this prop use, for example, one of the React's built-in methods to create a ref: [`React.createRef()`](https://reactjs.org/docs/refs-and-the-dom.html#creating-refs) or [`React.useRef()`](https://reactjs.org/docs/hooks-reference.html#useref).

```js
const MyComponent = (props) => {
  const iframeRef = React.useRef();

  React.useEffect(() => {
    // Use iframeRef for:
    // - focus managing
    // - triggering imperative animations
    // - integrating with third-party DOM libraries
    iframeRef.current.focus()
  }, [])

  return (
    <Frame ref={iframeRef}>
      <InnerComponent />
    </Frame>
  );
}
```

##### Accessing the iframe's window and document
The iframe's `window` and `document` may be accessed via the `FrameContextConsumer` or the `useFrame` hook.

The example with `FrameContextConsumer`:

```js
import Frame, { FrameContextConsumer } from 'react-frame-component'

const MyComponent = (props, context) => (
  <Frame>
    <FrameContextConsumer>
      {
        // Callback is invoked with iframe's window and document instances
        ({document, window}) => {
          // Render Children
        }
      }
    </FrameContextConsumer>
  </Frame>
);

```

The example with `useFrame` hook:

```js
import Frame, { useFrame } from 'react-frame-component';

const InnerComponent = () => {
  // Hook returns iframe's window and document instances from Frame context
  const { document, window } = useFrame();

  return null;
};

const OuterComponent = () => (
  <Frame>
    <InnerComponent />
  </Frame>
);
```

## More info

I wrote a [blog post][blog-url] about building this component.

## License

Copyright 2014, Ryan Seddon.
This content is released under the MIT license http://ryanseddon.mit-license.org

[npm-url]: https://npmjs.org/package/react-frame-component
[npm-image]: https://badge.fury.io/js/react-frame-component.png

[travis-url]: http://travis-ci.org/ryanseddon/react-frame-component
[travis-image]: https://secure.travis-ci.org/ryanseddon/react-frame-component.png?branch=master

[depstat-url]: https://david-dm.org/ryanseddon/react-frame-component
[depstat-image]: https://david-dm.org/ryanseddon/react-frame-component.png

[demo-url]: http://ryanseddon.github.io/react-frame-component/
[blog-url]: https://medium.com/@ryanseddon/rendering-to-iframes-in-react-d1cb92274f86
