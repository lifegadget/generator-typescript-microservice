import { IGeneratorDictionary } from "./@types";
import { validatationFactory } from "./validate";

export function install(context: IGeneratorDictionary) {
  const validate = validatationFactory(context.answers);
  context.log("Installing Yarn dependencies ...");

  const typings = [
    "@types/aws-sdk",
    "@types/chai",
    "@types/lodash",
    "@types/mocha",
    "@types/rimraf",
    "@types/handlebars",
    "@types/inquirer",
    "@types/js-yaml",
    "@types/webpack-node-externals"
  ];

  const globaldevDeps = [
    "async-shelljs",
    "chai",
    "chalk",
    // "handlebars",
    "inquirer",
    "js-yaml",
    "lodash.first",
    "lodash.last",
    "mocha",
    "prettier",
    "rimraf",
    "tslint",
    "tslint-config-prettier",
    "typescript",
    "ts-node",
    "ts-loader",
    "test-console",
    "simple-git",
    "webpack-cli",
    "webpack-node-externals",
    "webpack",
    "webpack-bundle-analyzer",
    "do-devops",
    "fast-glob"
  ];

  const serverlessOnlyDevDeps = [
    "serverless",
    "serverless-pseudo-parameters",
    "serverless-step-functions",
    "serverless-offline",
    "js-yaml",
    "fork-ts-checker-webpack-plugin",
    "serverless-log-forwarding"
  ];

  const notServerlessOnlyDevDeps = ["bili"];

  let devDeps = [...typings, ...globaldevDeps];

  devDeps = validate.isServerless()
    ? [...devDeps, ...serverlessOnlyDevDeps]
    : [...devDeps, ...notServerlessOnlyDevDeps];

  if (validate.useStaticDocs()) {
    devDeps = [...devDeps, "vuepress"];
  }

  let deps = ["common-types"];

  if (validate.isServerless()) {
    deps = [...deps, ...["aws-orchestrate", "aws-log", "aws-ssm", "aws-sdk"]];
  }

  if (validate.hasTemplating()) {
    deps = [...deps, ...["typed-template"]];
  }

  if (validate.hasFirebase()) {
    deps = [...deps, ...["abstracted-admin", "firemodel"]];
  }

  if (validate.useCoveralls()) {
    devDeps = [...devDeps, ...["nyc", "coveralls"]];
  }

  // first install what's in the package.json (which would have more rigid
  // locking on version number)
  context.spawnCommand("yarn", []);
  // then add the newest version of the given deps
  context.yarnInstall(devDeps, { dev: true });
  context.yarnInstall(deps);
}
