// tslint:disable:no-implicit-dependencies
import chalk from "chalk";

console.log(chalk.bold('Typescript Microservice: Help\n'));
console.log(`  ${chalk.blue( "build  " )}\ttranspiles all TS to JS`);
console.log(`  ${chalk.cyan( "deploy" )}\tdeploy either ALL the functions or specific functions`);
console.log(`  ${chalk.blue( "fns    " )}\tlists all serverless fn's defined`);
console.log(`  ${chalk.cyan( "package" )}\tpackages up a serverless assets but does not send them`);
console.log(`  ${chalk.blue( "test    " )}\truns all mocha unit tests`);
console.log(`  ${chalk.cyan( "list-secrets" )}\tlist all SSM Parameters/secrets in the given AWS profile`);
console.log(`  ${chalk.blue( "get-secret" )}\tgets details for a specific secret`);
console.log(`  ${chalk.cyan( "set-secret" )}\tsets ${chalk.italic( 'or updates' )} details for a specific secret`);
console.log(`  ${chalk.blue( "remove-secret" )}\tremoves a specific secret`);
console.log();
console.log(`  ${chalk.yellow( "deps   " )}\tconfigures a set of excluded node_modules for you; it is preferred that you use webpack instead`);


console.log();
