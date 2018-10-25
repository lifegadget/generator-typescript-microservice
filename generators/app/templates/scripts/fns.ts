import { getFunctions } from "./lib/serverless";
import chalk from "chalk";

(async () => {
  const fns = await getFunctions();
  Object.keys(fns).map((key: string) => {
    console.log(
      `${chalk.bold(key)} [ ${chalk.grey(
        String(fns[key].memorySize) + "mb, " + String(fns[key].timeout) + "s"
      )} ] : ${chalk.italic(fns[key].description)} ${chalk.reset(" ")}`
    );
  });
})();
