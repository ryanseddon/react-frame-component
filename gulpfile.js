var gulp = require('gulp');
var karma = require('gulp-karma');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

var testFiles = [
  'node_modules/es5-shim/es5-shim.js',
  'test/processed/Frame_spec.js'
];

gulp.task('build', function() {
  var bundler = browserify({
      entries: ['./test/Frame_spec.js']
  });

  return bundler
    .bundle()
    .pipe(source('Frame_spec.js'))
    .pipe(gulp.dest('./test/processed/'));
});

gulp.task('test', ['build'], function() {
  return gulp.src(testFiles)
    .pipe(karma({
      configFile: 'karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      throw err;
    });
});
