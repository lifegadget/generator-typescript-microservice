import { rm } from "async-shelljs";
import { writeFileSync } from "fs";
import path from "path";

/**
 * because the build process involves `import`ing certain
 * files and these files _might_ have typing errors (or JS errors);
 * it's better to remove them or replace them with a very plain
 * vanilla version to avoid these problems. These files will all
 * be reproduced as part of the build process anyway.
 */
export function clearOutFilesPriorToBuild() {
  rm(path.join(process.cwd(), "src/@types/build.ts"));
  writeFileSync(
    path.join(process.cwd(), "serverless-config/functions/inline.ts"),
    "export default {}",
    { encoding: "utf-8" }
  );
}
