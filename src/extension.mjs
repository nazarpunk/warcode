// noinspection NpmUsedModulesInstalled
import {languages} from "vscode";
import JassSemanticTokensLegend from "./jass/lexer/jass-semantic-tokens-legend.mjs";
import JassProvider from "./jass/jass-provider.mjs";
import WtsProvider from "./wts/wts-provider.mjs";

// noinspection JSUnusedGlobalSymbols
/** @param {import("vscode").ExtensionContext} context */
export function activate(context) {
    const wts = new WtsProvider();

    context.subscriptions.push(
        languages.registerDocumentSemanticTokensProvider(
            {language: 'jass'},
            new JassProvider(),
            JassSemanticTokensLegend,
        ),
        languages.registerDocumentSemanticTokensProvider(
            {language: 'wts'},
            wts,
            JassSemanticTokensLegend,
        ),
        languages.registerDocumentSymbolProvider({language: "wts"}, wts),
    );
}