import { IGeneratorDictionary, IFileConfiguration } from "./@types";
import chalk from "chalk";

/**
 * Copy's the input
 *
 * @param context the Generator object plus answers to all questions
 */
export const processFiles = (context: IGeneratorDictionary) =>
  /**
   * Takes a `name` to represent the files being copied, and a `config` which is
   * simply an array of files which need to be processed/copied.
   */
  (name: string, files: IFileConfiguration[]) => {
    files.map(f => {
      if (
        typeof f === "object" &&
        f.condition !== undefined &&
        f.condition === false
      ) {
        // if the file is conditional and condition evaluates to false
        // there's nothing to do
        return;
      }

      const filename = typeof f === "string" ? f : f.file;

      const from = context.templatePath(
        typeof f === "object" ? f.sourceFrom || filename : filename
      );
      const to = context.destinationPath(filename);

      try {
        if (to.includes("editorconfig")) {
          console.log(`${from} may have problem with ${to}`);
        }
        if (typeof f === "object" && f.substitute) {
          context.fs.copyTpl(from, to, f.substitute);
        } else {
          if (from && to) {
            context.fs.copy(from, to);
          }
        }
      } catch (e) {
        console.log(
          chalk`{red - Problem: } {blue ${from}} wasn't copied to {blue ${to}} because:\n{grey ${e.message}}.\n`
        );
      }
    });
    context.log(chalk`  - Completed copying {yellow ${name}} files`);
  };
