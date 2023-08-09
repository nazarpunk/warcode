// https://code.visualstudio.com/api/extension-guides/custom-editors
import {
    CustomTextEditorProvider,
    ExtensionContext, TextDocument, Uri, Webview,
    WebviewPanel,
    workspace
} from 'vscode'
import nonceGen from '../utils/nonce-gen'
import SlkPostMessage from './model/slk-post-message'

export default class SlkTableEditorProvider implements CustomTextEditorProvider {

    constructor(
        private readonly context: ExtensionContext
    ) {
    }

    public async resolveCustomTextEditor(
        document: TextDocument,
        webviewPanel: WebviewPanel,
    ): Promise<void> {
        webviewPanel.webview.options = {
            enableScripts: true,
        }
        webviewPanel.webview.html = this.#getHtmlForWebview(webviewPanel.webview)

        const updateWebview = () => webviewPanel.webview.postMessage({
            type: SlkPostMessage.update,
            text: document.getText(),
        })

        const documentDisposable = workspace.onDidChangeTextDocument(e => {
            if (e.document.uri.toString() === document.uri.toString()) updateWebview()
        })

        webviewPanel.onDidDispose(() => {
            documentDisposable.dispose()
        })

        updateWebview()
    }

    #getHtmlForWebview(webview: Webview): string {
        const exturi = this.context.extensionUri

        const jsUri = webview.asWebviewUri(Uri.joinPath(exturi, 'out', 'slkGrid.js'))
        const cssUri = webview.asWebviewUri(Uri.joinPath(exturi, 'src', 'slk', 'css', 'main.css'))

        const nonce = nonceGen()

        return `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource}; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<link href="${cssUri}" rel="stylesheet" />
				<link href="${cssUri}" rel="stylesheet" />

				<title>SLK Grid</title>
				<script nonce="${nonce}" src="${jsUri}" defer></script>
			</head>
			<body></body>
			</html>`
    }
}
