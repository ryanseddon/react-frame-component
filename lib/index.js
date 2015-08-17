'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var Frame = (function (_React$Component) {
  _inherits(Frame, _React$Component);

  _createClass(Frame, null, [{
    key: 'propTypes',
    value: {
      style: _react2['default'].PropTypes.object,
      head: _react2['default'].PropTypes.node
    },
    enumerable: true
  }]);

  function Frame(props, context) {
    _classCallCheck(this, Frame);

    _get(Object.getPrototypeOf(Frame.prototype), 'constructor', this).call(this, props, context);

    this.renderFrameContents = this.renderFrameContents.bind(this);
  }

  _createClass(Frame, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.renderFrameContents();
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this.renderFrameContents();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      _react2['default'].unmountComponentAtNode(_react2['default'].findDOMNode(this).contentDocument.body);
    }
  }, {
    key: 'renderFrameContents',
    value: function renderFrameContents() {
      var doc = _react2['default'].findDOMNode(this).contentDocument;
      if (doc && doc.readyState === 'complete') {
        var contents = _react2['default'].createElement('div', undefined, this.props.head, this.props.children);

        _react2['default'].render(contents, doc.body);
      } else {
        setTimeout(this.renderFrameContents, 0);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props;
      var children = _props.children;

      var other = _objectWithoutProperties(_props, ['children']);

      return _react2['default'].createElement('iframe', other);
    }
  }]);

  return Frame;
})(_react2['default'].Component);

exports['default'] = Frame;
;
module.exports = exports['default'];

