import Base = require("yeoman-generator");
import { IDictionary } from "common-types";
import chalk from "chalk";
import { kebabCase } from "lodash";
import yosay = require("yosay");
import * as fs from "fs";
import * as path from "path";

function isServerless(answers: IDictionary) {
  return answers.serverless === "serverless" ? true : false;
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
        default: this.appname,
        store: true
      },
      {
        type: "confirm",
        name: "wallaby",
        message:
          "Include Wallaby configuration -- a real-time testing tool -- in project",
        default: true,
        store: true
      },
      {
        type: "confirm",
        name: "travis",
        message: "Would you like to use Travis as part of CI solution?",
        default: true,
        store: true
      },
      {
        type: "list",
        name: "serverless",
        choices: ["serverless", "library-function"],
        message: `\n\n${chalk.bold(
          "Project Type: "
        )} although the primary function of this template is to setup for a Serverless project, you can also choose here to instead build a Typescript-driven library function`,
        default: "serverless",
        store: true
      }
    ]);
    this.answers = answers;
  }

  public async writing() {
    this.log("writing files ...");
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
          "scripts/build.ts",
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
              files: this.answers.serverless ? '["lib"]' : '["lib", "esm"]',
              module: this.answers.serverless ? "" : '"module": "esm/index.js",'
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
            condition: this.answers.travis
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

        const config = this.answers.serverless
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
      configResources()
    ]);
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

    // return this.installDependencies({ npm: false, yarn: true, bower: false });
    this.spawnCommand("yarn", []);
  }

  public end() {
    this.log(yosay(`\n${chalk.bold("Success!")}\nType "yarn run help" for help.`));
  }
}

export = Generator;
