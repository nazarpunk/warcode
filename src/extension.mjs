// noinspection NpmUsedModulesInstalled
import {languages} from "vscode";
import JassSemanticTokensLegend from "./jass/lexer/jass-semantic-tokens-legend.mjs";
import JassDocumentSemanticTokensProvider from "./jass/jass-document-semantic-tokens-provider.mjs";
import WtsDocumentSemanticTokensProvider from "./wts/wts-document-semantic-tokens-provider.mjs";

// noinspection JSUnusedGlobalSymbols
/** @param {import("vscode").ExtensionContext} context */
export function activate(context) {
    context.subscriptions.push(languages.registerDocumentSemanticTokensProvider(
        {language: 'jass'},
        new JassDocumentSemanticTokensProvider(),
        JassSemanticTokensLegend,
    ));

    context.subscriptions.push(languages.registerDocumentSemanticTokensProvider(
        {language: 'wts'},
        new WtsDocumentSemanticTokensProvider(),
        JassSemanticTokensLegend,
    ));
}