// noinspection DuplicatedCode

import {
    CancellationToken,
    CustomDocument,
    CustomDocumentBackup,
    Disposable,
    EventEmitter,
    Uri,
    workspace
} from 'vscode'
import BinaryDocumentDelegate from './model/binary-document-delegate'
import BinaryEditor from './model/binary-editor'


export class BinaryDocument implements CustomDocument {

    private _isDisposed = false

    protected _disposables: Disposable[] = []

    public dispose(): any {
        this._onDidDispose.fire()
        if (this._isDisposed) return
        this._isDisposed = true
        while (this._disposables.length) {
            const item = this._disposables.pop()
            if (item) item.dispose()
        }
    }

    #register<T extends Disposable>(value: T): T {
        if (this._isDisposed) value.dispose()
        else this._disposables.push(value)
        return value
    }

    static async create(
        uri: Uri,
        backupId: string | undefined,
        delegate: BinaryDocumentDelegate,
    ): Promise<BinaryDocument | PromiseLike<BinaryDocument>> {
        const dataFile = typeof backupId === 'string' ? Uri.parse(backupId) : uri
        const fileData = await BinaryDocument.#readFile(dataFile)
        return new BinaryDocument(uri, fileData, delegate)
    }

    static async #readFile(uri: Uri): Promise<Uint8Array> {
        if (uri.scheme === 'untitled') return new Uint8Array()
        return new Uint8Array(await workspace.fs.readFile(uri))
    }

    readonly uri: Uri

    documentData: Uint8Array
    private _edits: Array<BinaryEditor> = []
    private _savedEdits: Array<BinaryEditor> = []

    private readonly _delegate: BinaryDocumentDelegate

    private constructor(
        uri: Uri,
        initialContent: Uint8Array,
        delegate: BinaryDocumentDelegate
    ) {
        this.uri = uri
        this.documentData = initialContent
        this._delegate = delegate
    }

    private readonly _onDidDispose = this.#register(new EventEmitter<void>())
    public readonly onDidDispose = this._onDidDispose.event

    readonly #onDidChangeDocument = this.#register(new EventEmitter<{
        readonly content?: Uint8Array;
        readonly edits: readonly BinaryEditor[];
    }>())

    public readonly onDidChangeContent = this.#onDidChangeDocument.event

    readonly #onDidChange = this.#register(new EventEmitter<{
        readonly label: string,
        undo(): void,
        redo(): void,
    }>())

    public readonly onDidChange = this.#onDidChange.event

    makeEdit(edit: BinaryEditor) {
        this._edits.push(edit)

        this.#onDidChange.fire({
            label: 'Stroke',
            undo: async () => {
                this._edits.pop()
                this.#onDidChangeDocument.fire({
                    edits: this._edits,
                })
            },
            redo: async () => {
                this._edits.push(edit)
                this.#onDidChangeDocument.fire({
                    edits: this._edits,
                })
            }
        })
    }

    async save(cancellation: CancellationToken): Promise<void> {
        await this.saveAs(this.uri, cancellation)
        this._savedEdits = Array.from(this._edits)
    }

    async saveAs(targetResource: Uri, cancellation: CancellationToken): Promise<void> {
        const fileData = await this._delegate.getFileData()
        if (cancellation.isCancellationRequested) return
        await workspace.fs.writeFile(targetResource, fileData)
    }

    async revert(): Promise<void> {
        const diskContent = await BinaryDocument.#readFile(this.uri)
        this.documentData = diskContent
        this._edits = this._savedEdits
        this.#onDidChangeDocument.fire({
            content: diskContent,
            edits: this._edits,
        })
    }

    async backup(destination: Uri, cancellation: CancellationToken): Promise<CustomDocumentBackup> {
        await this.saveAs(destination, cancellation)

        return {
            id: destination.toString(),
            delete: async () => {
                try {
                    await workspace.fs.delete(destination)
                } catch {
                    // noop
                }
            }
        }
    }
}
