// noinspection DuplicatedCode

import {
    CancellationToken, CustomDocumentBackup, CustomDocumentBackupContext,
    CustomDocumentEditEvent,
    CustomEditorProvider,
    Disposable,
    EventEmitter,
    ExtensionContext,
    Uri, Webview,
    WebviewPanel,
    workspace
} from 'vscode'
import {BinaryDocument} from './binary-document'
import {WebviewCollection} from './webview-collection'
import nonceGen from '../utils/nonce-gen'
import BinaryEdit from './model/binary-edit'

export class BinaryEditorProvider implements CustomEditorProvider<BinaryDocument> {

    private readonly webviews = new WebviewCollection()

    constructor(
        private readonly _context: ExtensionContext
    ) {
    }

    async openCustomDocument(
        uri: Uri,
        openContext: { backupId?: string },
    ): Promise<BinaryDocument> {
        const document: BinaryDocument = await BinaryDocument.create(uri, openContext.backupId, {
            getFileData: async () => {
                const webviewsForDocument = Array.from(this.webviews.get(document.uri))
                if (!webviewsForDocument.length) {
                    throw new Error('Could not find webview to save for')
                }
                const panel = webviewsForDocument[0]
                const response = await this.postMessageWithResponse<number[]>(panel, 'getFileData', {})
                return new Uint8Array(response)
            }
        })

        const listeners: Disposable[] = []

        listeners.push(document.onDidChange(e => {
            this._onDidChangeCustomDocument.fire({
                document,
                ...e,
            })
        }))

        listeners.push(document.onDidChangeContent(e => {
            for (const webviewPanel of this.webviews.get(document.uri)) {
                this.postMessage(webviewPanel, 'update', {
                    edits: e.edits,
                    content: e.content,
                })
            }
        }))

        document.onDidDispose(() => {
            while (listeners.length) {
                const item = listeners.pop()
                if (item) item.dispose()
            }
        })

        return document
    }

    async resolveCustomEditor(
        document: BinaryDocument,
        webviewPanel: WebviewPanel,
    ): Promise<void> {
        this.webviews.add(document.uri, webviewPanel)
        webviewPanel.webview.options = {
            enableScripts: true,
        }
        webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview)

        webviewPanel.webview.onDidReceiveMessage(e => this.onMessage(document, e))

        webviewPanel.webview.onDidReceiveMessage(e => {
            if (e.type === 'ready') {
                if (document.uri.scheme === 'untitled') {
                    this.postMessage(webviewPanel, 'init', {
                        untitled: true,
                        editable: true,
                    })
                } else {
                    const editable = workspace.fs.isWritableFileSystem(document.uri.scheme)

                    this.postMessage(webviewPanel, 'init', {
                        value: document.documentData,
                        editable,
                    })
                }
            }
        })
    }

    private readonly _onDidChangeCustomDocument = new EventEmitter<CustomDocumentEditEvent<BinaryDocument>>()
    public readonly onDidChangeCustomDocument = this._onDidChangeCustomDocument.event

    public saveCustomDocument(document: BinaryDocument, cancellation: CancellationToken): Thenable<void> {
        return document.save(cancellation)
    }

    public saveCustomDocumentAs(document: BinaryDocument, destination: Uri, cancellation: CancellationToken): Thenable<void> {
        return document.saveAs(destination, cancellation)
    }

    public revertCustomDocument(document: BinaryDocument): Thenable<void> {
        return document.revert()
    }

    public backupCustomDocument(document: BinaryDocument, context: CustomDocumentBackupContext, cancellation: CancellationToken): Thenable<CustomDocumentBackup> {
        return document.backup(context.destination, cancellation)
    }

    private getHtmlForWebview(webview: Webview): string {
        // Local path to script and css for the webview
        const scriptUri = webview.asWebviewUri(Uri.joinPath(
            this._context.extensionUri, 'media', 'pawDraw.js'))

        const styleResetUri = webview.asWebviewUri(Uri.joinPath(
            this._context.extensionUri, 'media', 'reset.css'))

        const styleVSCodeUri = webview.asWebviewUri(Uri.joinPath(
            this._context.extensionUri, 'media', 'vscode.css'))

        const styleMainUri = webview.asWebviewUri(Uri.joinPath(
            this._context.extensionUri, 'media', 'pawDraw.css'))

        // Use a nonce to whitelist which scripts can be run
        const nonce = nonceGen()

        return /* html */`
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} blob:; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet" />
				<link href="${styleVSCodeUri}" rel="stylesheet" />
				<link href="${styleMainUri}" rel="stylesheet" />
				<title>Paw Draw</title>
			</head>
			<body>
				<div class="drawing-canvas"></div>

				<div class="drawing-controls">
					<button data-color="black" class="black active" title="Black"></button>
					<button data-color="white" class="white" title="White"></button>
					<button data-color="red" class="red" title="Red"></button>
					<button data-color="green" class="green" title="Green"></button>
					<button data-color="blue" class="blue" title="Blue"></button>
				</div>

				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`
    }

    private _requestId = 1
    private readonly _callbacks = new Map<number, (response: any) => void>()

    private postMessageWithResponse<R = unknown>(panel: WebviewPanel, type: string, body: any): Promise<R> {
        const requestId = this._requestId++
        const p = new Promise<R>(resolve => this._callbacks.set(requestId, resolve))
        panel.webview.postMessage({type, requestId, body})
        return p
    }

    private postMessage(panel: WebviewPanel, type: string, body: any): void {
        panel.webview.postMessage({type, body})
    }

    private onMessage(document: BinaryDocument, message: any) {
        switch (message.type) {
            case 'stroke':
                document.makeEdit(message as BinaryEdit)
                return

            case 'response': {
                const callback = this._callbacks.get(message.requestId)
                callback?.(message.body)
                return
            }
        }
    }
}

