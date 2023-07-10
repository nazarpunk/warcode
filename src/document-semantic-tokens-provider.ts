import * as vscode from 'vscode';

export class DocumentSemanticTokensProvider implements vscode.DocumentSemanticTokensProvider {
    #collection = vscode.languages.createDiagnosticCollection('jass');

    async provideDocumentSemanticTokens(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.SemanticTokens> {
        //const text = document.getText();
        const builder = new vscode.SemanticTokensBuilder();
        console.log('--- DocumentSemanticTokensProvider');

        try {
            builder.push(0, 0, 3, 0);
        } catch (e) {
            console.log(e);
        }

        this.#collection.clear();

        this.#collection.set(document.uri, [{
            code: '',
            message: 'cannot assign twice to immutable variable `x`',
            range: new vscode.Range(new vscode.Position(0, 0), new vscode.Position(3, 10)),
            severity: vscode.DiagnosticSeverity.Error,
            source: '',
            relatedInformation: [
                new vscode.DiagnosticRelatedInformation(new vscode.Location(document.uri, new vscode.Range(new vscode.Position(1, 8), new vscode.Position(1, 9))), 'Its WORKING!!!')
            ]
        }]);

        return builder.build();
    }
}