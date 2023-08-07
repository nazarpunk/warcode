import {
    CustomTextEditorProvider,
    Disposable,
    ExtensionContext, Range,
    TextDocument, Uri, Webview,
    WebviewPanel,
    window,
    workspace, WorkspaceEdit
} from 'vscode'
import nonceGen from '../utils/nonce-gen'

export class CatScratchEditorProvider implements CustomTextEditorProvider {

    public static register(context: ExtensionContext): Disposable {
        const provider = new CatScratchEditorProvider(context)
        return window.registerCustomEditorProvider(CatScratchEditorProvider.viewType, provider)
    }

    private static readonly viewType = 'catCustoms.catScratch'

    private static readonly scratchCharacters = ['😸', '😹', '😺', '😻', '😼', '😽', '😾', '🙀', '😿', '🐱']

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
        webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview)

        function updateWebview() {
            webviewPanel.webview.postMessage({
                type: 'update',
                text: document.getText(),
            })
        }

        const changeDocumentSubscription = workspace.onDidChangeTextDocument(e => {
            if (e.document.uri.toString() === document.uri.toString()) {
                updateWebview()
            }
        })

        webviewPanel.onDidDispose(() => {
            changeDocumentSubscription.dispose()
        })

        webviewPanel.webview.onDidReceiveMessage(e => {
            switch (e.type) {
                case 'add':
                    this.addNewScratch(document)
                    return

                case 'delete':
                    this.deleteScratch(document, e.id)
                    return
            }
        })

        updateWebview()
    }

    private getHtmlForWebview(webview: Webview): string {
        const scriptUri = webview.asWebviewUri(Uri.joinPath(
            this.context.extensionUri, 'src', 'slk', 'catScratch.js'))

        const styleResetUri = webview.asWebviewUri(Uri.joinPath(
            this.context.extensionUri, 'media', 'reset.css'))

        const styleVSCodeUri = webview.asWebviewUri(Uri.joinPath(
            this.context.extensionUri, 'media', 'vscode.css'))

        const styleMainUri = webview.asWebviewUri(Uri.joinPath(
            this.context.extensionUri, 'media', 'catScratch.css'))

        const nonce = nonceGen()

        return /* html */`
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource}; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<link href="${styleResetUri}" rel="stylesheet" />
				<link href="${styleVSCodeUri}" rel="stylesheet" />
				<link href="${styleMainUri}" rel="stylesheet" />

				<title>Cat Scratch</title>
			</head>
			<body>
				<div class="notes">
					<div class="add-button">
						<button>Scratch!</button>
					</div>
				</div>
				
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`
    }

    private addNewScratch(document: TextDocument) {
        const json = this.getDocumentAsJson(document)
        const character = CatScratchEditorProvider.scratchCharacters[Math.floor(Math.random() * CatScratchEditorProvider.scratchCharacters.length)]
        json.scratches = [
            ...(Array.isArray(json.scratches) ? json.scratches : []),
            {
                id: nonceGen(),
                text: character,
                created: Date.now(),
            }
        ]

        return this.updateTextDocument(document, json)
    }

    private deleteScratch(document: TextDocument, id: string) {
        const json = this.getDocumentAsJson(document)
        if (!Array.isArray(json.scratches)) {
            return
        }

        json.scratches = json.scratches.filter((note: any) => note.id !== id)

        return this.updateTextDocument(document, json)
    }

    private getDocumentAsJson(document: TextDocument): any {
        const text = document.getText()
        if (text.trim().length === 0) {
            return {}
        }

        try {
            return JSON.parse(text)
        } catch {
            throw new Error('Could not get document as json. Content is not valid json')
        }
    }

    private updateTextDocument(document: TextDocument, json: any) {
        const edit = new WorkspaceEdit()

        // Just replace the entire document every time for this example extension.
        // A more complete extension should compute minimal edits instead.
        edit.replace(
            document.uri,
            new Range(0, 0, document.lineCount, 0),
            JSON.stringify(json, null, 2))

        return workspace.applyEdit(edit)
    }
}
