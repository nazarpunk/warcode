import {Uri, WebviewPanel} from 'vscode'

export class WebviewCollection {
    private readonly _webviews = new Set<{
        readonly resource: string;
        readonly webviewPanel: WebviewPanel;
    }>()

    public* get(uri: Uri): Iterable<WebviewPanel> {
        const key = uri.toString()
        for (const entry of this._webviews) if (entry.resource === key) yield entry.webviewPanel
    }

    public add(uri: Uri, webviewPanel: WebviewPanel) {
        const entry = {resource: uri.toString(), webviewPanel}
        this._webviews.add(entry)

        webviewPanel.onDidDispose(() => this._webviews.delete(entry))
    }
}
