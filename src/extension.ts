import * as vscode from 'vscode';
import {DocumentSemanticTokensProvider} from "./document-semantic-tokens-provider";
import {TokenLegendList} from "./token-legend";

// noinspection JSUnusedGlobalSymbols
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.languages.registerDocumentSemanticTokensProvider(
        {language: 'jass'},
        new DocumentSemanticTokensProvider(),
        new vscode.SemanticTokensLegend(TokenLegendList, [])
    ));
}