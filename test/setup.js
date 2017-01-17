import * as jsdom from 'jsdom';

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
const win = doc.defaultView;
global.document = doc;
global.window = win;

// from mocha-jsdom https://github.com/rstacruz/mocha-jsdom/blob/master/index.js#L80
function propagateToGlobal(input) {
  Object.keys(input).forEach((key) => {
    if (key in global) {
      return;
    }
    global[key] = input[key];
  });
}

propagateToGlobal(win);
