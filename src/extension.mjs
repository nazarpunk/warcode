import {languages, SemanticTokensLegend} from "vscode";
import {JassDocumentSemanticTokensProvider} from "./jass-document-semantic-tokens-provider.mjs";
import {TokenLegendList} from "./token-legend.mjs";

// noinspection JSUnusedGlobalSymbols
/** @param {import("vscode").ExtensionContext} context */
export function activate(context) {
    context.subscriptions.push(languages.registerDocumentSemanticTokensProvider(
        {language: 'jass'},
        new JassDocumentSemanticTokensProvider(),
        new SemanticTokensLegend(TokenLegendList, [])
    ));
}