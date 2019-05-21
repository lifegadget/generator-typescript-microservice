interface IAsyncStreamCallback {
    output: string[];
    restore(): void;
}
declare type AsyncIgnoreCallback = () => void;
interface ITestStream {
    inspect(): IAsyncStreamCallback;
    ignore(): AsyncIgnoreCallback;
    inspectSync(): string[];
    ignoreSync(): void;
}
declare module 'test-console' {
    let stdout: ITestStream;
    let stderr: ITestStream;
}
