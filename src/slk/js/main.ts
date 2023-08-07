type VSCode = {
    postMessage(message: any): void;
    getState(): any;
    setState(state: any): void;
}

{
    // @ts-ignore
    const vscode: VSCode = acquireVsCodeApi()

    const updateContent = (text: string) => {
        document.body.textContent = text
    }

    window.addEventListener('message', (event: MessageEvent) => {

        //vscode.postMessage({type: SlkPostMessage.log, log: event})

        const message = event.data
        switch (message.type) {
            //case SlkPostMessage.update:
            case 'update':
                const text = message.text
                updateContent(text)
                vscode.setState({text})
                return
        }
    })

    const state = vscode.getState()
    if (state) updateContent(state.text)
}
