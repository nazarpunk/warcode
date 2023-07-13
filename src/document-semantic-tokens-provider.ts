import * as vscode from 'vscode';
import {JassVisit} from "../jass/visitor";
import {Diagnostic} from "vscode";

export class DocumentSemanticTokensProvider implements vscode.DocumentSemanticTokensProvider {
    #collection = vscode.languages.createDiagnosticCollection('jass');

    async provideDocumentSemanticTokens(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.SemanticTokens> {
        const builder = new vscode.SemanticTokensBuilder();
        this.#collection.clear();

        const diagnostic: Diagnostic[] = [];
        JassVisit(document.getText(), builder);


        if (diagnostic.length > 0) this.#collection.set(document.uri, diagnostic);

        return builder.build();
    }
}