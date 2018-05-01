import Base = require("yeoman-generator");
import { IDictionary } from "common-types";
import chalk from "chalk";
import { kebabCase } from "lodash";
import yosay = require("yosay");
import * as fs from "fs";
import * as path from "path";
import { initializing } from "./initializing";
import { prompting } from "./prompting";
import { install } from "./install";
import { writing, IFileConfiguration } from "./writing";
import { validatationFactory } from "./validate";
import { test } from "async-shelljs";

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
    return install(this);
  }

  public end() {
    if (!test("-d", ".git")) {
      require("simple-git")
        .init()
        .add("./*")
        .commit("initial commit");
      this.log(
        `- ${chalk.bold(
          "git"
        )} has been initialized and files added as an initial commit 🚀`
      );
    }
    // tslint:disable-next-line:no-submodule-imports
    this.log("- git status: ", require("simple-git/promise").status());

    this.log(yosay(`\n${chalk.bold("Success!")}\nType "yarn run help" for help.`));
  }
}

export = Generator;
