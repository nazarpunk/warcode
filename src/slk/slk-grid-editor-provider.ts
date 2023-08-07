// https://code.visualstudio.com/api/extension-guides/custom-editors
import {
    CustomTextEditorProvider,
    Disposable,
    ExtensionContext, TextDocument, Uri, Webview,
    WebviewPanel,
    window,
    workspace
} from 'vscode'
import nonceGen from '../utils/nonce-gen'

export const enum SlkPostMessage {
    update = 'update',
    log = 'log',
}

export class SlkGridEditorProvider implements CustomTextEditorProvider {

    public static register(context: ExtensionContext): Disposable {
        const provider = new SlkGridEditorProvider(context)
        return window.registerCustomEditorProvider(SlkGridEditorProvider.viewType, provider)
    }

    private static readonly viewType = 'slkGrid.slk'

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
            //type: SlkPostMessage.update,
            type: 'update',
            text: document.getText(),
        })

        const documentDisposable = workspace.onDidChangeTextDocument(e => {
            if (e.document.uri.toString() === document.uri.toString()) updateWebview()
        })

        webviewPanel.onDidDispose(() => {
            documentDisposable.dispose()
        })

        /*
        webviewPanel.webview.onDidReceiveMessage(e => {
            switch (e.type as SlkPostMessage) {
                case SlkPostMessage.log:
                    console.log(e)
                    return
            }
        })

         */

        updateWebview()
    }

    #getHtmlForWebview(webview: Webview): string {
        const jsUri = webview.asWebviewUri(Uri.joinPath(this.context.extensionUri, 'out', 'slkGrid.js'))

        const cssUri = webview.asWebviewUri(Uri.joinPath(this.context.extensionUri, 'src', 'slk', 'css', 'main.css'))

        const nonce = nonceGen()

        return /* html */`
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
