// https://code.visualstudio.com/api/extension-guides/custom-editors
import {
    CustomTextEditorProvider,
    ExtensionContext,
    TextDocument,
    Uri,
    WebviewPanel,
    window,
    workspace,
    Range,
    WorkspaceEdit
} from 'vscode'
import nonceGen from '../utils/nonce-gen'
import SlkPostMessage from './model/slk-post-message'
import {Mutex} from '../utils/mutex'

const map: Record<string, Mutex> = {}

export default class SlkEditorProvider implements CustomTextEditorProvider {

    constructor(
        private readonly context: ExtensionContext
    ) {
    }

    public resolveCustomTextEditor(
        document: TextDocument,
        webviewPanel: WebviewPanel,
    ): void {
        const uri = Uri.joinPath(this.context.extensionUri, 'out', 'slk')

        const nonce = nonceGen()
        const wv = webviewPanel.webview

        wv.options = {
            enableScripts: true,
        }

        wv.html = `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none';
				 style-src ${wv.cspSource} 'unsafe-inline';
				 script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${wv.asWebviewUri(Uri.joinPath(uri, 'main.css'))}" rel="stylesheet" />
			    <script nonce="${nonce}" src="${wv.asWebviewUri(Uri.joinPath(uri, 'main.js'))}" type="module" defer></script>
				<title>SLK Editor</title>
			</head><body><div class="app"></div><div id="portal" /></body></html>`

        wv.onDidReceiveMessage(async e => {
            switch (e.type as SlkPostMessage) {
                case SlkPostMessage.error:
                    window.showErrorMessage(e.data)
                    return
                case SlkPostMessage.update:
                    const mutex = map[document.uri.path] ??= new Mutex()
                    return await mutex.run(async () => {
                        const edit = new WorkspaceEdit()
                        edit.replace(document.uri, new Range(0, 0, document.lineCount, 0), e.content)
                        await workspace.applyEdit(edit)
                    })
            }
        })

        wv.postMessage({
            type: SlkPostMessage.init,
            text: document.getText(),
        })
    }
}
