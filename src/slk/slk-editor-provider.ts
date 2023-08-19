// https://code.visualstudio.com/api/extension-guides/custom-editors
import {CustomTextEditorProvider, ExtensionContext, TextDocument, Uri, WebviewPanel, window} from 'vscode'
import nonceGen from '../utils/nonce-gen'
import SlkPostMessage from './model/slk-post-message'

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
			</head><body><div class="app"></div></body></html>`

        wv.onDidReceiveMessage(e => {
            switch (e.type as SlkPostMessage) {
                case SlkPostMessage.error:
                    window.showErrorMessage(e.data)
                    return
            }
        })

        wv.postMessage({
            type: SlkPostMessage.init,
            text: document.getText(),
        })
    }
}
