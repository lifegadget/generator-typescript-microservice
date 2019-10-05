import chalk from "chalk";
import yosay = require("yosay");
import { IGeneratorDictionary } from "./@types";
import simplegit from "simple-git/promise";

export async function closure(context: IGeneratorDictionary) {
  const git = simplegit(context.destinationPath());
  try {
    const checkIsRepo = await git.checkIsRepo();

    if (checkIsRepo) {
      console.log(
        chalk`{grey - This project is already setup as a git repo; doing nothing more}`
      );
    } else {
      console.log(
        chalk`{grey - this project has {italic not yet} been setup as a git repository}`
      );

      await git.init();
      console.log(
        chalk`- This project has been registered as a {bold git} project`
      );

      if (context.answers.repoOrigin) {
        await git.addRemote("origin", context.answers.repoOrigin);
        console.log(
          chalk`- added "remote" for git repo: {italic grey ${context.answers.repoOrigin}}`
        );
      }
    }
  } catch (e) {
    console.log(`- attempts to setup git for you failed but that's our fault`);
    console.log(`- error message was: ${e.message}`);
    console.log(`\n{grey ${e.stack}\n`);
    console.log(
      chalk`- anyway, outside of the {bold git} fumble, all else is well :)`
    );
  }

  console.log(
    yosay(`\n${chalk.bold("Success!")}\nType "yarn run help" for help.`)
  );
}
