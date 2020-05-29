import { IHandlerReference } from ".";
import { IServerlessFunction } from "common-types";
import * as fs from "fs";
import path from "path";
import { promisify } from "util";
const writeFile = promisify(fs.writeFile);

/**
 * Writes to the `serverless-config/functions/inline.ts` file
 * all of the handler functions which were found off the "handlers"
 * directory.
 *
 * The configuration will only include the reference to the `handler`
 * file unless the function exports a `config` property to express
 * other configuration properties.
 */
export async function writeInlineFunctions(handlers: IHandlerReference[]) {
  let contents = 'import { IServerlessFunction } from "common-types";\n\n';
  const fnNames = [];
  for (const handler of handlers) {
    const localPath = handler.file
      .replace(/.*src\//, "src/")
      .replace(".ts", "");
    const functionName = handler.file
      .split("/")
      .pop()
      .replace(".ts", "");
    fnNames.push(functionName);
    let config: IServerlessFunction = {
      handler: `${localPath}.handler`
    };
    if (handler.ref.config) {
      config = { ...config, ...handler.ref.config };
    }

    contents += `const ${functionName}: IServerlessFunction = {\n`;
    Object.keys(config).forEach(key => {
      let value = config[key as keyof typeof config];
      if (typeof value === "string") {
        value = `"${value.replace(/"/g, '\\"')}"`;
      }
      if (typeof value === "object") {
        value = JSON.stringify(value);
      }
      contents += `  ${key}: ${value},\n`;
    });
    contents += "}\n\n";
  }
  contents += `export default {\n  ${fnNames.join(",\n  ")}\n}`;

  await writeFile(
    path.join(process.cwd(), "serverless-config/functions/inline.ts"),
    contents,
    { encoding: "utf-8" }
  );
}
