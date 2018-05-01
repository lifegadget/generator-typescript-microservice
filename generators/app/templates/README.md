# <%- appName %>

<%- npmBadge %><%- testBadges %><%- coverageBadges %><%- licenseBadges %>
<%- socialBadges %>

Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis at ab recusandae fugiat, saepe molestiae doloribus assumenda rem voluptates non illum nemo dolorem architecto animi obcaecati esse eius et iure

## Getting started

### Installation
```
git clone <%- repoOrigin %>
yarn && yarn upgrade
```

### Build
Building does the following:

- runs **tslint**
- transpiles TS to JS
- takes serverless configuration and injects into `serverless.yml`

```sh
yarn run build
```


### Deployment

Deployment runs a build and then pushes your serverless project/function to your cloud provider.

```sh
# deploy everything
yarn run deploy
# deploy a specific function or step-function
yarn run deploy [fn]
```

### Testing
Testing leverages the `mocha` test runner and the `chai` assertions library. All tests can be found in the `/test` directory. 

```sh
# test everything
yarn run test
# test a subset of scripts
yarn run test [search]
```

## Serverless

Most of the service definition/configuration you will do for your serverless function will be found in the `serverless-config` directory. 

### Environment Variables

The `env.yml` file in the `serverless-configuration` folder will look something like:

```yml
global: &all_stages
  MAILGUN_API_KEY: "pubkey-xxyyzz"
  MAILGUN_API_SECRET: "key-xxyyzz"

dev:
  <<: *all_stages
  AWS_STAGE: 'dev'
  FIREBASE_SERVICE_ACCOUNT: ""
  FIREBASE_DATA_ROOT_URL: ""

stage:
  <<: *all_stages
  AWS_STAGE: 'stage'
  FIREBASE_SERVICE_ACCOUNT: ""
  FIREBASE_DATA_ROOT_URL: ""

prod:
  <<: *all_stages
  AWS_STAGE: 'prod'
  FIREBASE_SERVICE_ACCOUNT: ""
  FIREBASE_DATA_ROOT_URL: ""
```

This configuration allows for global variables as well as _stage_-specific settings. These variables will be brought up to your cloud provider the first time you do a full deployment.

### Functions

Serverless is all about functions and while the normal method of defining them is within the `serverless.yml` file this quickly becomes cumbersome so instead we've created a more composable way of defining your functions in TypeScript. This means you can more modularity but it also means you get _typing_ for your functions. 

For instance, you can define a function like so:

**serverless-config/functions/foobar.ts**
```ts
const transportPrep: IServerlessFunction = {
  description:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  handler: "lib/foobar.handler",
  environment: "${file(env.yml):${self:custom.stage}}",
  timeout: 10,
  memorySize: 1024,
  package: {
    exclude: [...standardExclusions]
  }
};
```
