// https://code.visualstudio.com/api/extension-guides/custom-editors
import {
    CustomTextEditorProvider,
    ExtensionContext, TextDocument, Uri, WebviewPanel,
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
				 img-src ${webviewPanel.webview.cspSource};
				 style-src ${webviewPanel.webview.cspSource} 'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=';
				 script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${webviewPanel.webview.asWebviewUri(Uri.joinPath(exturi, 'src', 'slk', 'css', 'main.css'))}" rel="stylesheet" />
				<title>SLK Grid</title>
			</head>
			<body>
			<vscode-data-grid id="basic-grid"></vscode-data-grid>
			<script nonce="${nonce}">${fix}</script>
			<script nonce="${nonce}" src="${webviewPanel.webview.asWebviewUri(Uri.joinPath(exturi, 'out', 'SlkGrid.js'))}"></script>
			</body>
			</html>`

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
}
