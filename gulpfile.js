var gulp = require('gulp');
var react = require('gulp-react');
var rename = require('gulp-rename');
var karma = require('gulp-karma');
var browserify = require('gulp-browserify');

var testFiles = [
  'node_modules/es5-shim/es5-shim.js',
  'test/libs/react-with-addons.js',
  'index.js',
  'test/processed/Frame_spec.js'
];

gulp.task('build', function() {
  return gulp.src('src/Frame.js')
    .pipe(react())
    .pipe(browserify({
      standalone: 'Frame'
    }))
    .pipe(rename('index.js'))
    .pipe(gulp.dest('./'))
    .pipe(gulp.src('test/Frame_spec.js'))
    .pipe(react())
    .pipe(gulp.dest('test/processed'));
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
