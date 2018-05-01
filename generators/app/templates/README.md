<%- npmBadge %><%- testBadges %><%- coverageBadges %><%- licenseBadges %><%- socialBadges %>

[![Build Status](https://travis-ci.org/{{github-user-name}}/{{github-app-name}}.svg?branch=master)](https://travis-ci.org/{{github-user-name}}/{{github-app-name}}.svg?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/{{github-user-name}}/{{github-app-name}}/badge.svg?branch=master)](https://coveralls.io/github/{{github-user-name}}/{{github-app-name}}?branch=master)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)

# <%- appName %>

Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis at ab recusandae fugiat, saepe molestiae doloribus assumenda rem voluptates non illum nemo dolorem architecto animi obcaecati esse eius et iure

## Getting started

### Installation
```
git clone <% repo %>
yarn && yarn upgrade
```

## Serverless

Most of the service definition/configuration you will do for your serverless function will be found in the `serverless-config` directory. Please look at the various README's spread around to understand the various components better.

### CLI Commands

All CLI commands are based off of you using `yarn run [cmd]` and for that reason you might consider having a shell alias setup as `alias cli=\`yarn run\`` ... it just makes the whole process more graceful. :)

The commands available include:

- build - tslint, transpiles, rebuilds your `serverless.yml`
- deploy - this is for both functions and step-functions (no parameters does the whole thing)
- 

but you can always just look in the `scripts` directory for a list and to gain a better understanding of what is happening. 

> Note: the `scripts/lib` directory is there for most of the heavy lifting and in some cases is not wired up by default but it more of library of _things_ which the files in the `scripts` directory can use.

