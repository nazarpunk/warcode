// noinspection NpmUsedModulesInstalled
import {languages, SemanticTokensLegend} from "vscode";
import {JassDocumentSemanticTokensProvider} from "./jass/jass-document-semantic-tokens-provider.mjs";
import JassTokenLegendList from "../jass/lexer/jass-token-legend-list.mjs";

// noinspection JSUnusedGlobalSymbols
/** @param {import("vscode").ExtensionContext} context */
export function activate(context) {
    context.subscriptions.push(languages.registerDocumentSemanticTokensProvider(
        {language: 'jass'},
        new JassDocumentSemanticTokensProvider(),
        new SemanticTokensLegend(JassTokenLegendList, [])
    ));
}