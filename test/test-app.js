'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('node-typescript:app with gulp', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({
        skipInstall: true,
        gulp: true
      })
      .on('end', done);
  });

  it('creates necessary files', function () {
    assert.file([
      '.vscode/tasks.json',
      '.vscode/settings.json',
      'src/index.ts',
      'package.json',
      'tsconfig.json',
      'tslint.json',
      '.editorconfig',
      '.gitignore',
      'LICENSE',
      'README.md',
      'wallaby.js',
      'serverless.yml'
    ]);
  });

});

describe('node-typescript:app without gulp', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({
        skipInstall: true
      })
      .on('end', done);
  });

  it('creates project files', function () {
    assert.file([
      '.vscode/tasks.json',
      '.vscode/settings.json',
      'src/index.ts',
      'package.json',
      'tsconfig.json',
      'tslint.json',
      '.travis.yml',
      '.editorconfig',
      '.gitignore',
      'LICENSE',
      'README.md'
    ]);
  });

});
