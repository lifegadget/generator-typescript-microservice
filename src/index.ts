import Generator from "yeoman-generator";
import chalk from "chalk";

export class TypescriptMicroservices extends Generator {
  initializing() {
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

  async prompting() {
    const answers = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname,
        store: true
      },
      {
        type: ""
      }
    ]);
    this.options = { ...this.options, ...answers };
  }

  public writing = {
    async testResources() {
      return new Promise(resolve => {});
    },
    async projectResources() {
      return new Promise(resolve => {});
    },
    async generalResources() {
      return new Promise(resolve => {});
    }
  };

  async install() {
    await this.yarnInstall();
  }

  end() {
    this.log(
      '\nOk, all set. Enjoy. Type "yarn run help" for a list of commands you can use in your project environment.\n'
    );
  }
}
