interface IAsyncStreamCallback {
  output: string[];
  restore(): void;
}

type AsyncIgnoreCallback = () => void;

interface ITestStream {
  inspect(): IAsyncStreamCallback;
  ignore(): AsyncIgnoreCallback;
  inspectSync(): string[];
  ignoreSync(): void;
}

declare module 'test-console' {
  export let stdout: ITestStream;
  export let stderr: ITestStream;
}
