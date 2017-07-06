module.exports = function(w) {
  return {
    // runAllTestsInAffectedTestFile: true,
    files: [
      'src/**/*.ts',
      { "pattern": "env.yml", "instrument": false },
      { "pattern": "test/testing/helpers.ts", "instrument": false },
      { "pattern": "test/testing/test-console.ts", "instrument": false },
    ],

    tests: [
      'test/**/*-spec.ts'
    ],

    env: {
      type: 'node',
      runner: 'node',
    },

    compilers: {
      '**/*.ts': w.compilers.typeScript({ module: 'commonjs' })
    },

    setup() {

      if (!process.env.AWS_STAGE) {
        process.env.AWS_STAGE = 'test';
      }

      if (!console._restored) {
        console.log('console.log stream returned to normal for test purposes');
        console.log = function () {
          return require('console').Console.prototype.log.apply(this, arguments);
        }
        console.error = function () {
          return require('console').Console.prototype.error.apply(this, arguments);
        }
        console._restored = true;
      }
    },

    testFramework: 'mocha',
    debug: true
  }
}