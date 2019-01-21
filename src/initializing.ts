import { IDictionary } from "common-types";
import * as fs from "fs";
import * as path from "path";
import chalk from "chalk";

export const initializing = (context: IDictionary) => () => {
  // const graphic = fs.readFileSync(path.join(__dirname, "../../computer.txt"), {
  //   encoding: "utf-8"
  // });
  context.log(computerText);
  context.log(
    chalk.bold(
      "\nWelcome to the " + chalk.green("TypeScript for Serverless") + " generator!\n"
    )
  );

  context.log(
    chalk.grey(
      `- This template is targetted at ${chalk.white(
        "AWS"
      )} but -- in part -- should work with other cloud platforms as well.\n` +
        `- ${chalk.white(
          "YARN"
        )} is the assumed package manager; but switching to NPM should be relatively easy.\n` +
        `- the build system is written entirely in ${chalk.white(
          "TypeScript"
        )} rather than an external library like gulp, grunt, etc.\n\n`
    )
  );
};


const computerText = `
    ┌──────────────────────┐
    │......................│
    │......................│
    │......................│
    │......................│
    │......................│
    │......................│
    │......................│
    │......................│
    └──────────────────────┘
     **********************
    ***                  ***
    **              *******
    ****************\n`;
