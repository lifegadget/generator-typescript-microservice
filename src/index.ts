import Base = require("yeoman-generator");
import { IDictionary } from "common-types";
import chalk from "chalk";
import { kebabCase } from "lodash";
import yosay = require("yosay");

interface IComplexFileConfiguration {
  file: string;
  condition?: boolean;
  substitute?: IDictionary;
}
type IFileConfiguration = IComplexFileConfiguration | string;

class Generator extends Base {
  constructor(args: any[], opts: any) {
    super(args, opts);
  }

  public options: IDictionary;
  public initializing() {
    this.log(
      chalk.bold(
        "Welcome to the " + chalk.green("TypeScript for Serverless") + " generator!"
      )
    );

    this.log(
      chalk.white(
        "- This template is primarily meant for AWS micro-services but big portions of it should apply equally well to other cloud platforms.\n" +
          "- we assume the use of YARN over NPM but if you're a fan of the NPM cli then making the necessary changes should be relatively easy.\n" +
          "- the build system leverages 'yarn run' rather than an external library like gulp, etc."
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
        name: "use Wallaby?",
        message:
          "Include Wallaby configuration -- a real-time testing tool -- in project",
        default: true,
        store: true
      }
    ]);
    this.options = { ...this.options, ...answers };
    this.log("options: ", this.options);

    this.config.save();
  }

  public async writing() {
    this.log("writing files ...");
    const testResources = () => {
      return new Promise(resolve => {
        resolve();
      });
    };
    const projectResources = () => {
      return new Promise(resolve => {
        resolve();
      });
    };
    const buildScripts = () => {
      return new Promise(resolve => {
        resolve();
      });
    };

    const configResources = () => {
      return new Promise(async resolve => {
        const rootConfigFiles: IFileConfiguration[] = [
          {
            file: "package.json",
            substitute: {
              appname: kebabCase(this.options.appName),
              author: `${this.user.git.name()} <${this.user.git.email()}>`,
              keywords: this.options.serverless
                ? '["serverless", "typescript"]'
                : '["typescript"]',
              files: this.options.serverless ? '["lib"]' : '["lib", "esm"]',
              module: this.options.serverless ? "" : '"module": "esm/index.js",'
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
            condition: this.options.travis
          }
        ];

        const serverlessConfig: IFileConfiguration[] = [
          {
            file: "serverless.yml",
            substitute: {
              appname: kebabCase(this.options.appName)
            }
          },
          "serverless-config/env.yml",
          "serverless-config/"
        ];

        const config = this.options.serverless
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
    // return new Promise(resolve => {
    this.log(`- Copying across ${name} files`);
    config.map(c => {
      if (typeof c === "object" && c.condition !== undefined && c.condition) {
        return;
      }
      const filename = typeof c === "string" ? c : c.file;
      // const [path, file]: [string[], string] =
      //   fileParts.length >= 1
      //     ? [fileParts.slice(0, fileParts.length - 1), fileParts.slice(-1)[0]]
      //     : [[""], fileParts[0]];

      const from = this.templatePath(filename);
      const to = this.destinationPath(filename);

      if (typeof c === "object" && c.substitute) {
        this.log(`copying template "${from}" to "${to}"`);
        this.fs.copyTpl(from, to, c.substitute);
      } else {
        this.log(`copying "${from}" to "${to}"`);
        this.fs.copy(from, to);
      }
      // });
    });
  }

  public async install() {
    await this.yarnInstall();
  }

  public end() {
    this.log(yosay('\nSuccess. Type "yarn run help" for help.'));
  }
}

export = Generator;
