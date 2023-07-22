// noinspection NpmUsedModulesInstalled
import {languages} from "vscode";
import {JassDocumentSemanticTokensProvider} from "./jass/jass-document-semantic-tokens-provider.mjs";
import JassSemanticTokensLegend from "../jass/lexer/jass-semantic-tokens-legend.mjs";

// noinspection JSUnusedGlobalSymbols
/** @param {import("vscode").ExtensionContext} context */
export function activate(context) {
    context.subscriptions.push(languages.registerDocumentSemanticTokensProvider(
        {language: 'jass'},
        new JassDocumentSemanticTokensProvider(),
        JassSemanticTokensLegend,
    ));
}