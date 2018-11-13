Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.FrameContextConsumer = exports.FrameContextProvider = undefined;

const _react = require('react');

const _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

let doc = void 0;
let win = void 0;
if (typeof document !== 'undefined') {
  doc = document;
}
if (typeof window !== 'undefined') {
  win = window;
}

const _React$createContext = _react2.default.createContext({
  document: doc,
  window: win
});

let FrameContextProvider = _React$createContext.Provider,
  FrameContextConsumer = _React$createContext.Consumer;
exports.FrameContextProvider = FrameContextProvider;
exports.FrameContextConsumer = FrameContextConsumer;
