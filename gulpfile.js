'use strict';

const gulp = require('gulp');
const boilerplate = require('appium-gulp-plugins').boilerplate.use(gulp);
const gulpIf = require('gulp-if');
const debug = require('gulp-debug');
const log = require('fancy-log');
const argv = require('yargs').argv;
const mochaStream = require('spawn-mocha-parallel').mochaStream;
const path = require('path');
const _ = require('lodash');


boilerplate({
  build: 'appium-xcuitest-driver',
  projectRoot: __dirname,
  coverage: {
    files: ['./build/test/unit/**/*-specs.js', '!./build/test/functional/**'],
    verbose: false
  },
});

gulp.task('e2e-test:parallel', function runParallelTests () {
  const opts = {
    flags: {
      u: 'bdd-with-opts',
      R: 'spec',
      c: true,
    },
    exit: true,
    bin: path.join(__dirname, 'node_modules', '.bin', 'mocha'),
    concurrency: 30,
    env: process.env,
  };

  let tests = argv.tests;
  tests = Array.isArray(tests) ? tests : [tests];
  tests = _.map(tests, (test) => path.resolve(__dirname, 'build', 'test', test));

  return gulp.src(tests, {read: false})
    .pipe(gulpIf(true, debug()))
    .pipe(mochaStream(opts))
    .on('error', log.error.bind(log));
});
