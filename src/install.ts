import { IGeneratorDictionary } from "./writing";
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
    "@types/chance",
    "@types/faker",
    "@types/js-yaml"
  ];

  const globaldevDeps = [
    "async-shelljs",
    "chai",
    "chance",
    "faker",
    "handlebars",
    "inquirer",
    "lodash.first",
    "lodash.last",
    "mocha",
    "coveralls",
    "nyc",
    "prettier",
    "rimraf",
    "tslint",
    "tslint-config-prettier",
    "typescript",
    "ts-node",
    "test-console"
  ];

  const serverlessOnlyDevDeps = [
    "serverless",
    "serverless-pseudo-parameters",
    "serverless-step-functions",
    "js-yaml"
  ];

  let devDeps = [...typings, ...globaldevDeps];

  if (validate.isServerless()) {
    devDeps = [...devDeps, ...serverlessOnlyDevDeps];
  }

  if (validate.useStaticDocs()) {
    devDeps = [...devDeps, "vuepress"];
  }

  let deps = ["common-types"];

  if (validate.hasTemplating()) {
    deps = [...deps, ...["typed-template"]];
  }

  if (validate.hasFirebase()) {
    deps = [...deps, ...["abstracted-admin", "firemodel"]];
  }

  // first install what's in the package.json (which would have more rigid
  // locking on version number)
  context.spawnCommand("yarn", []);
  // then add the newest version of the given deps
  context.yarnInstall(devDeps, { dev: true });
  context.yarnInstall(deps);
}
