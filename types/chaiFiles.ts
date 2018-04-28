type IChaiFile = (file: string) => string;
type IChaiDir = (dir: string) => string[];

declare module "chai-files" {
  export let file: IChaiFile;
  export let dir: IChaiDir;
}
