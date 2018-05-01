import Base = require("yeoman-generator");
import { IDictionary } from "common-types";
import chalk from "chalk";
import { kebabCase } from "lodash";
import yosay = require("yosay");
import * as fs from "fs";
import * as path from "path";
import { initializing } from "./initializing";
import { prompting } from "./prompting";
import { writing, IFileConfiguration } from "./writing";
import { validatationFactory } from "./validate";

function isServerless(answers: IDictionary) {
  return answers.serverless === "serverless" ? true : false;
}

function hasTemplating(answers: IDictionary) {
  return has(answers, "features", "typed-template");
}

function hasFirebase(answers: IDictionary) {
  return has(answers, "features", "firebase");
}

function useTravis(answers: IDictionary) {
  return has(answers, "testing", "travis");
}

function useBadge(name: string, answers: IDictionary) {
  return (
    has(answers, "testing", name) ||
    has(answers, "coverage", name) ||
    has(answers, "features", name)
  );
}

function useNpm(answers: IDictionary) {
  return has(answers, "features", "npm");
}

function has(answers: IDictionary, category: string, feature: string): boolean {
  const features = new Set(answers[category]);
  return features.has(feature);
}

class Generator extends Base {
  constructor(args: any[], opts: any) {
    super(args, opts);
  }

  public options: IDictionary;
  public answers: IDictionary = {};
  public badges: IDictionary;

  public initializing() {
    initializing(this)();
  }

  public async prompting() {
    await prompting(this)();
  }

  public async writing() {
    return writing(this, validatationFactory(this))();
  }

  public install() {
    this.log("Installing Yarn dependencies ...");

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

    if (isServerless(this.answers)) {
      devDeps = [...devDeps, ...serverlessOnlyDevDeps];
    }

    let deps = ["common-types"];

    if (hasTemplating(this.answers)) {
      deps = [...deps, ...["typed-template"]];
    }

    if (hasFirebase(this.answers)) {
      deps = [...deps, ...["abstracted-admin", "firemodel"]];
    }

    // first install what's in the package.json (which would have more rigid
    // locking on version number)
    this.spawnCommand("yarn", []);
    // then add the newest version of the given deps
    this.yarnInstall(devDeps, { dev: true });
    this.yarnInstall(deps);
  }

  public end() {
    this.log(yosay(`\n${chalk.bold("Success!")}\nType "yarn run help" for help.`));
  }
}

export = Generator;
