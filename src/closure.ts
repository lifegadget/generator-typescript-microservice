import chalk from "chalk";
import yosay = require("yosay");
import * as git from "./git/git";
import { IGeneratorDictionary } from "./@types";

export async function closure(context: IGeneratorDictionary) {
  // const git = require("simple-git")(context.destinationPath());
  try {
    const checkIsRepo = await git.checkIsRepo(context)();
    const initializeRepo = git.initializeRepo(context);
    const addRemote = git.addRemote(context);

    if (checkIsRepo) {
      console.log(
        chalk`{grey - This project is already setup as a git repo; doing nothing more}`
      );
    } else {
      console.log(
        chalk`{grey - this project has {italic not yet} been setup as a }`
      );

      await initializeRepo();
      console.log(
        chalk`- This project has been registered as a {bold git} project`
      );

      if (context.answers.repoOrigin) {
        await addRemote("origin", context.answers.repoOrigin);
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
