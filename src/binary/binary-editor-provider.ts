import {
    CancellationToken,
    CustomDocumentBackup,
    CustomDocumentBackupContext,
    CustomDocumentEditEvent,
    CustomEditorProvider,
    Disposable,
    EventEmitter,
    ExtensionContext,
    Uri,
    WebviewPanel,
    workspace
} from 'vscode'
import {BinaryDocument} from './binary-document'
import {WebviewCollection} from './webview-collection'
import nonceGen from '../utils/nonce-gen'
import BinaryEditor from './model/binary-editor'
import BinaryMessage from './model/binary-message'
import * as path from 'path'

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

        const exturi = this._context.extensionUri
        const nonce = nonceGen()
        // <link rel="stylesheet" href="${webviewPanel.webview.asWebviewUri(Uri.joinPath(exturi, 'src', 'binary', 'css', 'main.css'))}">
        webviewPanel.webview.html = `<!DOCTYPE html><html lang="en"><head>
				<meta charset="UTF-8">
				<meta http-equiv="Content-Security-Policy" content="
				default-src 'none'; 
				img-src ${webviewPanel.webview.cspSource} blob:;
				style-src ${webviewPanel.webview.cspSource} 'unsafe-inline';
				script-src 'nonce-${nonce}';
				">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<script nonce="${nonce}" defer src="${webviewPanel.webview.asWebviewUri(Uri.joinPath(exturi, 'out', 'binary.js'))}" ></script>
				<title>Binary</title>
			</head><body>Under construction...</body></html>`

        webviewPanel.webview.onDidReceiveMessage(e => this.onMessage(document, e))

        webviewPanel.webview.onDidReceiveMessage(e => {
            if (e.type as BinaryMessage === BinaryMessage.ready) {
                if (document.uri.scheme === 'untitled') {
                    this.postMessage(webviewPanel, BinaryMessage.init, {
                        untitled: true,
                        editable: true,
                    })
                } else {
                    const editable = workspace.fs.isWritableFileSystem(document.uri.scheme)

                    this.postMessage(webviewPanel, BinaryMessage.init, {
                        value: document.documentData,
                        path: path.parse(document.uri.path),
                        editable: editable,
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
                document.makeEdit(message as BinaryEditor)
                return

            case 'response': {
                const callback = this._callbacks.get(message.requestId)
                callback?.(message.body)
                return
            }
        }
    }
}

