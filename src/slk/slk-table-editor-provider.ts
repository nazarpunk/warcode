// https://code.visualstudio.com/api/extension-guides/custom-editors
import {CustomTextEditorProvider, ExtensionContext, TextDocument, Uri, WebviewPanel, window, workspace} from 'vscode'
import nonceGen from '../utils/nonce-gen'
import SlkPostMessage from './model/slk-post-message'

export default class SlkTableEditorProvider implements CustomTextEditorProvider {

    constructor(
        private readonly context: ExtensionContext
    ) {
    }

    public resolveCustomTextEditor(
        document: TextDocument,
        webviewPanel: WebviewPanel,
    ): void {
        const exturi = this.context.extensionUri
        const nonce = nonceGen()

        webviewPanel.webview.options = {
            enableScripts: true,
        }

        const fix = 'window.module = {};'
        webviewPanel.webview.html = `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none';
				 img-src ${webviewPanel.webview.cspSource} https://resources.datagridxl.com/dgxl-logo-icon.svg;
				 style-src ${webviewPanel.webview.cspSource} 'unsafe-inline';
				 script-src 'nonce-${nonce}' 'unsafe-eval';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${webviewPanel.webview.asWebviewUri(Uri.joinPath(exturi, 'src', 'slk', 'css', 'main.css'))}" rel="stylesheet" />
				<script nonce="${nonce}">${fix}</script>
			    <script nonce="${nonce}" src="${webviewPanel.webview.asWebviewUri(Uri.joinPath(exturi, 'out', 'datagridxl2.js'))}" defer></script>
			    <script nonce="${nonce}" src="${webviewPanel.webview.asWebviewUri(Uri.joinPath(exturi, 'out', 'SlkGrid.js'))}" defer></script>
				<title>SLK Grid</title>
			</head>
			<body><div class="wrap"><div id="slk-table"></div></div></body>
			</html>`

        webviewPanel.webview.onDidReceiveMessage(e => {
            switch (e.type as SlkPostMessage) {
                case SlkPostMessage.error:
                    window.showErrorMessage(e.data)
                    return
            }
        })

        const updateWebview = () => webviewPanel.webview.postMessage({
            type: SlkPostMessage.update,
            text: document.getText(),
        })

        webviewPanel.onDidDispose(() => {
            workspace.onDidChangeTextDocument(e => {
                if (e.document.uri.toString() === document.uri.toString()) updateWebview()
            }).dispose()
        })

        updateWebview()
    }
}
