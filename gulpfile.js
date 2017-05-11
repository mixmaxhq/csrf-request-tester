const gulp = require('gulp');
const Erik = require('erik');
const server = require('./src');
const runSequence = require('run-sequence');

gulp.task('server', function() {
  server.start();
});

new Erik({
  gulp: gulp,
  watch: false,
  karmaConfig: {
    port: 8201,
    browsers: ['Chrome', 'Firefox', 'Safari']
  },
  taskDependencies: ['server'],
  localDependencies: [
    'spec/tests.js'
  ],
  bundlePath: 'spec'
});

gulp.task('default', ['erik']);
