# TypeScript Microservice Generator

A generator to start quickly using the [Serverless Framework](https://serverless.com/) with TypeScript
source code. This generator provides the following:

* **DevOps**
  * `build`, `deploy`, `watch` and many other useful devop scripts
  * All devop scipts written in TS; doesn't depend on any 3rd party build tools like Gulp, Grunt, etc.
* **Testing**:
  * Mocha test runner with chai assertion library
  * Configuration setup for using [Wallaby](http://wallabyjs.com) real-time testing in your editor
* **Serverless Enhancements**
  * Larger projects based on the Serverless framework tend to lead to a quite cluttered `serverless.yml` file; with this generator the build process will allow you to decompose the configuration in a sensible way.
  * The `serverless-step-functions` addon provides easy access AWS's Step functions
  * Typings provided for all serverless configuration allows your configuration to be checked within your editor before you try and deploy it as well as providing a better way of exploring the API surface allowed in configuration (with intellisence autocomplete and comments)

## Install

```
npm i -g yo@latest
npm i -g generator-typescript-microservice
cd [PROJECT DIRECTORY]
yo typescript-microservice
```
