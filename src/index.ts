import Generator = require("yeoman-generator");
import { IDictionary } from "common-types";
import chalk from "chalk";
import { kebabCase } from "lodash";
import { isNullOrUndefined } from "util";
import yosay = require("yosay");

export interface IComplexFileConfiguration {
  file: string;
  condition?: boolean;
  substitute?: IDictionary;
}
type IFileConfiguration = IComplexFileConfiguration | string;

export class TypescriptMicroservice extends Generator {
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
        type: "checkbox",
        name: "use Wallaby?",
        message:
          "Wallaby is a great real-time testing tool that works with your Mocha tests (you do need a license though)",
        default: true,
        store: true
      }
    ]);
    this.options = { ...this.options, ...answers };
    this.config.save();
  }

  public writing = {
    testResources: async () => {
      return new Promise(resolve => {
        //
      });
    },
    projectResources: async () => {
      return new Promise(resolve => {
        //
      });
    },
    buildScripts: async () => {
      return new Promise(resolve => {
        //
      });
    },
    configResources: async () => {
      const rootConfigFiles: IFileConfiguration[] = [
        {
          file: "package.json",
          substitute: {
            appname: kebabCase(this.options.appName),
            author: `${this.user.git.name} <${this.user.git.email}>`
          }
        },
        ".editorconfig",
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
      return this._private_processFiles("configuration", config);
    }
  };

  private async _private_processFiles(name: string, config: IFileConfiguration[]) {
    return new Promise(resolve => {
      this.log(`- Copying across ${name} files`);
      config.map(c => {
        if (typeof c === "object" && c.condition !== undefined && c.condition) {
          return;
        }
        const filename = typeof c === "string" ? c : c.file;
        const from = this.templatePath(`_${filename}`);
        const to = this.destinationPath(filename);
        if (typeof c === "object" && c.substitute) {
          this.fs.copyTpl(from, to, c.substitute);
        } else {
          this.fs.copy(from, to);
        }
      });
    });
  }

  public async install() {
    await this.yarnInstall();
  }

  public end() {
    this.log(yosay('\nSuccess. Type "yarn run help" for help.'));
  }
}

export default TypescriptMicroservice;
