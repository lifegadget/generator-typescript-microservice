// tslint:disable:no-implicit-dependencies
import chalk from "chalk";
import { asyncExec } from "async-shelljs";

export async function javaCompile() {
  console.log(chalk.green(`- Packaging all Java files into a JAR`));
  try {
    await asyncExec(`mvn package`);
    console.log(chalk.green(`- Java class files compiled 👍`));
  } catch (e) {
    console.log(chalk.red(`- Java build/packaging failed 😡`));
    process.exit(1);
  }
}

export async function mavenClean() {
  await asyncExec("mvn clean");
  return;
}
