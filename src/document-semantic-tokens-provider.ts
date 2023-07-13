import * as vscode from 'vscode';
import {JassVisit} from "../jass/visitor";

export class DocumentSemanticTokensProvider implements vscode.DocumentSemanticTokensProvider {
    #collection = vscode.languages.createDiagnosticCollection('jass');

    async provideDocumentSemanticTokens(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.SemanticTokens> {
        const builder = new vscode.SemanticTokensBuilder();
        JassVisit(document.getText(), builder);
        this.#collection.clear();
        /*
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
         */

        return builder.build();
    }
}