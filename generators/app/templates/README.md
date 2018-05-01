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

### Deployment

```sh
# deploy everything
yarn run deploy
# deploy a specific function or step-function
yanr run deploy [fn]
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

Most of the service definition/configuration you will do for your serverless function will be found in the `serverless-config` directory. Please look at the various README's spread around to understand the various components better.

### CLI Commands

All CLI commands are based off of you using `yarn run [cmd]` and for that reason you might consider having a shell alias setup as `alias cli="yarn run"` ... it just makes the whole process more graceful. :)

The commands available include:

- build - tslint, transpiles, rebuilds your `serverless.yml`
- deploy - this is for both functions and step-functions (no parameters does the whole thing)

but you can always just look in the `scripts` directory for a list and to gain a better understanding of what is happening. 

> Note: the `scripts/lib` directory is there for most of the heavy lifting and in some cases is not wired up by default but it more of library of _things_ which the files in the `scripts` directory can use.

