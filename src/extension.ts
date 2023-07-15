import * as vscode from 'vscode';
import {JassDocumentSemanticTokensProvider} from "./jass-document-semantic-tokens-provider";
import {TokenLegendList} from "./token-legend";

// noinspection JSUnusedGlobalSymbols
export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.languages.registerDocumentSemanticTokensProvider(
        {language: 'jass'},
        new JassDocumentSemanticTokensProvider(),
        new vscode.SemanticTokensLegend(TokenLegendList, [])
    ));
}