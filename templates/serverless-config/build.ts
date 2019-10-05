import config from "./config";
import {
  findAllHandlerFiles,
  writeInlineFunctions,
  clearOutFilesPriorToBuild
} from "./helpers";
// type IServerlessAccountInfo = import("do-devops").IServerlessAccountInfo;

/**
 * Provides a means for do-devops to remotely execute
 */
(async () => {
  try {
    clearOutFilesPriorToBuild();
    const handlers = await findAllHandlerFiles();
    await writeInlineFunctions(handlers);

    const accountInfo = JSON.parse(process.argv[2]);
    const serverlessConfig = config(accountInfo);
    console.log(JSON.stringify(serverlessConfig));
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
})();
