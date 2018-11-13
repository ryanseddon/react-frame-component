Object.defineProperty(exports, '__esModule', {
  value: true
});

const _extends =
  Object.assign ||
  function(target) {
    for (let i = 1; i < arguments.length; i++) {
      const source = arguments[i];
      for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

const _createClass = (function() {
  function defineProperties(target, props) {
    for (let i = 0; i < props.length; i++) {
      const descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

const _react = require('react');

const _react2 = _interopRequireDefault(_react);

const _reactDom = require('react-dom');

const _reactDom2 = _interopRequireDefault(_reactDom);

const _propTypes = require('prop-types');

const _propTypes2 = _interopRequireDefault(_propTypes);

const _Context = require('./Context');

const _Content = require('./Content');

const _Content2 = _interopRequireDefault(_Content);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return call && (typeof call === 'object' || typeof call === 'function')
    ? call
    : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(
      `Super expression must either be null or a function, not ${typeof superClass}`
    );
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
}

const Frame = (function(_Component) {
  _inherits(Frame, _Component);

  // React warns when you render directly into the body since browser extensions
  // also inject into the body and can mess up React. For this reason
  // initialContent is expected to have a div inside of the body
  // element that we render react into.
  function Frame(props, context) {
    _classCallCheck(this, Frame);

    const _this = _possibleConstructorReturn(
      this,
      (Frame.__proto__ || Object.getPrototypeOf(Frame)).call(
        this,
        props,
        context
      )
    );

    _this.handleLoad = function() {
      _this.forceUpdate();
    };

    _this._isMounted = false;
    return _this;
  }

  _createClass(Frame, [
    {
      key: 'componentDidMount',
      value: function componentDidMount() {
        this._isMounted = true;

        const doc = this.getDoc();
        if (doc && doc.readyState === 'complete') {
          this.forceUpdate();
        } else {
          this.node.addEventListener('load', this.handleLoad);
        }
      }
    },
    {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        this._isMounted = false;

        this.node.removeEventListener('load', this.handleLoad);
      }
    },
    {
      key: 'getDoc',
      value: function getDoc() {
        return this.node.contentDocument; // eslint-disable-line
      }
    },
    {
      key: 'getMountTarget',
      value: function getMountTarget() {
        const doc = this.getDoc();
        if (this.props.mountTarget) {
          return doc.querySelector(this.props.mountTarget);
        }
        return doc.body.children[0];
      }
    },
    {
      key: 'renderFrameContents',
      value: function renderFrameContents() {
        if (!this._isMounted) {
          return null;
        }

        const doc = this.getDoc();

        const contentDidMount = this.props.contentDidMount;
        const contentDidUpdate = this.props.contentDidUpdate;

        const win = doc.defaultView || doc.parentView;
        const initialRender = !this._setInitialContent;
        const contents = _react2.default.createElement(
          _Content2.default,
          {
            contentDidMount,
            contentDidUpdate
          },
          _react2.default.createElement(
            _Context.FrameContextProvider,
            { value: { document: doc, window: win } },
            _react2.default.createElement(
              'div',
              { className: 'frame-content' },
              this.props.children
            )
          )
        );

        if (initialRender && this.props.initialContent) {
          doc.open('text/html', 'replace');
          doc.write(this.props.initialContent);
          doc.close();
          this._setInitialContent = true;
        }

        const mountTarget = this.getMountTarget();

        return [
          _reactDom2.default.createPortal(this.props.head, this.getDoc().head),
          _reactDom2.default.createPortal(contents, mountTarget)
        ];
      }
    },
    {
      key: 'render',
      value: function render() {
        const _this2 = this;

        const props = _extends({}, this.props, {
          children: undefined // The iframe isn't ready so we drop children from props here. #12, #17
        });
        delete props.head;
        delete props.initialContent;
        delete props.mountTarget;
        delete props.contentDidMount;
        delete props.contentDidUpdate;
        return _react2.default.createElement(
          'iframe',
          _extends({}, props, {
            ref: function ref(node) {
              return (_this2.node = node);
            }
          }),
          this.renderFrameContents()
        );
      }
    }
  ]);

  return Frame;
})(_react.Component);

Frame.propTypes = {
  style: _propTypes2.default.object, // eslint-disable-line
  head: _propTypes2.default.node,
  initialContent: _propTypes2.default.string,
  mountTarget: _propTypes2.default.string,
  contentDidMount: _propTypes2.default.func,
  contentDidUpdate: _propTypes2.default.func,
  children: _propTypes2.default.oneOfType([
    _propTypes2.default.element,
    _propTypes2.default.arrayOf(_propTypes2.default.element)
  ])
};
Frame.defaultProps = {
  style: {},
  head: null,
  children: undefined,
  mountTarget: undefined,
  contentDidMount: function contentDidMount() {},
  contentDidUpdate: function contentDidUpdate() {},
  initialContent:
    '<!DOCTYPE html><html><head></head><body><div class="frame-root"></div></body></html>'
};
exports.default = Frame;
