export type AcquireVscodeApi = {
    postMessage(message: any): void;
    getState(): {
        text: string
    } | undefined;
    setState(state: any): void;
}
