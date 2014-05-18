# React &lt;Frame /> component

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]

This component allows you to encapsulate your entire React application or per component in an iFrame.

```bash
npm install --save react-frame-component
```


## How to use:

This is a UMD module so you can include however you like.

### UMD what now?

If you're not sure what that is you can include this as a `<script>` tag in your site and it will be available as a `Frame` global.

Go check out the [demo] [demo-url].

```html
var Header = React.createClass({
  render: function() {
    return (
      <Frame>
        <h1>{this.props.children}</h1>
      </Frame>
    );
  }
});

React.renderComponent(<Header>Hello</Header>, document.body);
```

Or you can wrap it at the `renderComponent` call.

```html
React.renderComponent(
  <Frame>
    <Header>Hello</Header>
  </Frame>,
  document.body
);
```

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

