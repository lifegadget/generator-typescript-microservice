import Base = require("yeoman-generator");
import { IDictionary } from "common-types";
import chalk from "chalk";
import { kebabCase } from "lodash";
import yosay = require("yosay");
import * as fs from "fs";
import * as path from "path";

const TYPED_TEMPLATES_VERSION: string = "^0.5.0";

function isServerless(answers: IDictionary) {
  return answers.serverless === "serverless" ? true : false;
}

function hasTemplating(answers: IDictionary) {
  const features = new Set(answers.features);
  return features.has("typed-template");
}

function hasFirebase(answers: IDictionary) {
  const features = new Set(answers.features);
  return features.has("firebase");
}

function useTravis(answers: IDictionary) {
  const features = new Set(answers.features);
  return features.has("travis");
}

interface IComplexFileConfiguration {
  file: string;
  condition?: boolean;
  substitute?: IDictionary;
  /** allows you to state a source filename which is distinct from the output file name */
  sourceFrom?: string;
}
type IFileConfiguration = IComplexFileConfiguration | string;

class Generator extends Base {
  constructor(args: any[], opts: any) {
    super(args, opts);
  }

  public options: IDictionary;
  public answers: IDictionary;

  public initializing() {
    const graphic = fs.readFileSync(path.join(__dirname, "../../computer.txt"), {
      encoding: "utf-8"
    });
    this.log(graphic);
    this.log(
      chalk.bold(
        "\nWelcome to the " + chalk.green("TypeScript for Serverless") + " generator!\n"
      )
    );

    this.log(
      chalk.grey(
        `- This template is primarily meant for ${chalk.white(
          "AWS"
        )} micro-services but big portions of it should apply equally well to other cloud platforms.\n` +
          `- we assume the use of ${chalk.white(
            "YARN"
          )} over NPM but if you're a fan of the NPM cli then making the necessary changes should be relatively easy.\n` +
          "- the build system leverages 'yarn run' rather than an external library like gulp, etc.\n\n"
      )
    );
  }

  public async prompting() {
    const answers = await this.prompt([
      {
        type: "input",
        name: "appName",
        message: "Your project name",
        default: kebabCase(this.appname),
        store: true
      },
      {
        type: "checkbox",
        name: "features",
        message: "Choose the features/packages you'd like to include:",
        choices: [
          {
            name: `Include ${chalk.yellow.bold(
              "Wallaby"
            )} configuration -- a real-time testing tool -- in project`,
            value: "wallaby"
          },
          {
            name: `Add ${chalk.yellow.bold(
              "typed-template"
            )} and directories to support for structured templating requirements`,
            value: "typed-template"
          },
          {
            name: `${chalk.bold.yellow("firebase")} support provided via ${chalk.bold(
              "firemodel"
            )} and ${chalk.bold("abstracted-admin")}`,
            value: "firebase"
          },
          {
            name: `Include ${chalk.yellow.bold("Travis")} as part of CI solution?`,
            value: "travis"
          },
          {
            name: `Will be deployed to ${chalk.yellow.bold("npm")}?`,
            value: "npm"
          },
          {
            name: `Will be using  ${chalk.yellow.bold("Coveralls")} code coverage?`,
            value: "coveralls"
          }
        ],
        default: ["wallaby", "travis", "npm", "typed-template"],
        store: true
      },
      {
        type: "list",
        name: "serverless",
        choices: ["serverless", "library-function"],
        message: `${chalk.bold("Project Type: ")} \n\n${chalk.reset(
          "although the primary function of this template is to setup for a Serverless project, you can also choose to instead build just a Typescript-driven library function: "
        )}`,
        default: "serverless",
        store: true
      }
    ]);
    this.answers = answers;
  }

  public async writing() {
    this.log("\n\nwriting files ...");
    const testResources = () => {
      return new Promise(resolve => {
        const config: IFileConfiguration[] = [
          "test/ping-spec.ts",
          "test/data/README.md",
          "test/testing/helpers.ts",
          "test/testing/test-console.ts"
        ];
        this._private_processFiles("test", config);
        resolve();
      });
    };
    const projectResources = () => {
      return new Promise(resolve => {
        const serverlessConfig: IFileConfiguration[] = [
          "src/handlers/ping.ts",
          "src/models/README.md",
          "src/shared/README.md"
        ];
        const libraryConfig: IFileConfiguration[] = ["src/index.ts"];
        this._private_processFiles(
          "project",
          isServerless(this.answers) ? serverlessConfig : libraryConfig
        );
        resolve();
      });
    };
    const templatingResources = () => {
      return new Promise(resolve => {
        const templating: IFileConfiguration[] = [
          "templates/templates/example-template/default.hbs",
          "templates/templates/example-template/email-html.hbs",
          "templates/templates/example-template/email-text.hbs",
          "templates/templates/example-template/sms.hbs",
          "templates/layouts/email-html/default.hbs",
          "templates/layouts/email-text/default.hbs",
          "templates/layouts/default.hbs",
          "templates/README.md"
        ];
        this._private_processFiles(
          "templating",
          hasTemplating(this.answers) ? templating : []
        );
        resolve();
      });
    };
    const buildScripts = () => {
      return new Promise(resolve => {
        const config: IFileConfiguration[] = [
          {
            file: "scripts/build.ts",
            condition: isServerless(this.answers),
            sourceFrom: "scripts/build-serverless.ts"
          },
          {
            file: "scripts/build.ts",
            condition: !isServerless(this.answers),
            sourceFrom: "scripts/build-library.ts"
          },
          "scripts/deploy.ts",
          "scripts/test.ts",
          {
            file: "scripts/invoke.ts",
            condition: isServerless(this.answers)
          },
          {
            file: "scripts/package.ts",
            condition: isServerless(this.answers)
          },
          {
            file: "scripts/publish.ts",
            condition: !isServerless(this.answers)
          },
          "scripts/watch.ts",
          "scripts/lib/java.ts",
          "scripts/lib/js.ts",
          "scripts/lib/npm.ts",
          {
            file: "scripts/lib/serverless.ts",
            condition: isServerless(this.answers)
          }
        ];
        this._private_processFiles("build/devops", config);
        resolve();
      });
    };

    const configResources = () => {
      return new Promise(async resolve => {
        const rootConfigFiles: IFileConfiguration[] = [
          {
            file: "package.json",
            substitute: {
              appname: kebabCase(this.answers.appName),
              author: `${this.user.git.name()} <${this.user.git.email()}>`,
              keywords: this.answers.serverless
                ? '["serverless", "typescript"]'
                : '["typescript"]',
              files: isServerless(this.answers) ? '["lib"]' : '["lib", "esm"]',
              module: isServerless(this.answers) ? "" : '"module": "esm/index.js",'
            }
          },
          {
            file: "README.md",
            substitute: {
              travisBadge: useTravis(this.answers) ? this._private_addBadge("travis") : ""
            }
          },
          ".editorconfig",
          ".gitignore",
          ".vscode/launch.json",
          ".vscode/settings.json",
          ".vscode/tasks.json",
          ".gitignore",
          {
            file: "travis.yml",
            condition: useTravis(this.answers)
          }
        ];

        const serverlessConfig: IFileConfiguration[] = [
          {
            file: "serverless.yml",
            substitute: {
              appname: kebabCase(this.answers.appName)
            }
          },
          "serverless-config/env.yml",
          "serverless-config/"
        ];

        const config = isServerless(this.answers)
          ? [...rootConfigFiles, ...serverlessConfig]
          : rootConfigFiles;

        this._private_processFiles("configuration", config);
        resolve();
      });
    };

    return Promise.all([
      testResources(),
      projectResources(),
      buildScripts(),
      configResources(),
      templatingResources()
    ]);
  }

  private _private_addBadge(type: string): string {
    // TODO: complete
    return "";
  }

  private _private_processFiles(name: string, config: IFileConfiguration[]) {
    config.map(c => {
      if (typeof c === "object" && c.condition !== undefined && c.condition) {
        return;
      }
      const filename = typeof c === "string" ? c : c.sourceFrom || c.file;
      const from = this.templatePath(filename);
      const to = this.destinationPath(filename);

      if (typeof c === "object" && c.substitute) {
        this.fs.copyTpl(from, to, c.substitute);
      } else {
        this.fs.copy(from, to);
      }
    });
    this.log(`  ✔ Completed copying ${name} files`);
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
