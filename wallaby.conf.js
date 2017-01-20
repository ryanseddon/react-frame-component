const wallabyWebpack = require('wallaby-webpack'); // eslint-disable-line import/no-extraneous-dependencies

module.exports = function configure(wallaby) {
  const wallabyPostprocessor = wallabyWebpack({
    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    module: {
      noParse: [
        /node_modules\/sinon/
      ],
      loaders: [
        { test: /\.json$/, loader: 'json-loader' }
      ]
    }
  });

  return {
    debug: true,
    files: [
      { pattern: 'src/**/*.js*', load: false },
      { pattern: 'app/reducers/**/*.js*', load: false },
      { pattern: 'app/components/**/*.js*', load: false }
    ],
    tests: [
      { pattern: 'test/**/*.spec.js*', load: false }
    ],
    compilers: {
      '**/*.js?(x)': wallaby.compilers.babel()
    },
    postprocessor: wallabyPostprocessor,
    testFramework: 'mocha',
    env: {
      kind: 'electron'
    },
    setup: function setup() {
      window.__moduleBundler.loadTests();
    }
  };
};
