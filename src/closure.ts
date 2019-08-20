import chalk from "chalk";
import yosay = require("yosay");

export async function closure(context: import("yeoman-generator")) {
  const git = require("simple-git")(this.destinationPath());
  // if (!test("-d", ".git")) {
  //   git
  //     .init()
  //     .add("./*")
  //     .commit("initial commit");
  //   this.log(
  //     `- ${chalk.bold(
  //       "git"
  //     )} has been initialized and files added as an initial commit ðŸš€`
  //   );
  // }
  if (this.answers.repoOrigin) {
    git.addRemote("origin", this.answers.repoOrigin);
    this.log(
      `- a repo origin has been added to git of "${
        this.answers.repoOrigin
      }" ä·›`
    );
  }

  this.log(
    yosay(`\n${chalk.bold("Success!")}\nType "yarn run help" for help.`)
  );
}
