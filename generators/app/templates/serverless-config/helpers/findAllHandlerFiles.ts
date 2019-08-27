import path from "path";
import fg from "fast-glob";
import { IServerlessConfig } from "common-types";

export interface IHandlerReference {
  file: string;
  ref: {
    handler: () => void;
    config?: Omit<IServerlessConfig, "handler">;
  };
}

/**
 * Finds all typescript files in the `src/handlers`
 * directory which have a **handler** export.
 */
export async function findAllHandlerFiles(): Promise<Array<IHandlerReference>> {
  const glob = path.join(process.env.PWD, "/src/handlers/**/*.ts");
  const files = fg.sync(glob);
  const handlers = [];

  for await (const file of files) {
    let ref;
    try {
      ref = await import(file);
      if (ref.handler) {
        handlers.push({ file, ref });
      }
    } catch (e) {
      console.log(`- failed to import "${file}": ${e.message}`);
    }
  }

  return handlers;
}
