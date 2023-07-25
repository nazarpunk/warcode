// noinspection NpmUsedModulesInstalled
import {languages} from "vscode";
import ExtSemanticTokensLegend from "./semantic/ext-semantic-tokens-legend.mjs";
import ExtProvider from "./utils/ext-provider.mjs";
import {WtsParser} from "./wts/wts-parser.mjs";
import {WtsVisitor} from "./wts/wts-visitor.mjs";
import {JassParser} from "./jass/jass-parser.mjs";
import {JassVisitor} from "./jass/jass-visitor.mjs";

// noinspection JSUnusedGlobalSymbols
/** @param {import("vscode").ExtensionContext} context */
export function activate(context) {
    const jass = new ExtProvider('jass', {
        parser: new JassParser(),
        visitor: new JassVisitor(),
    });

    const wts = new ExtProvider('wts', {
        parser: new WtsParser(),
        visitor: new WtsVisitor(),
    });

    context.subscriptions.push(
        languages.registerDocumentSemanticTokensProvider({language: jass.name}, jass, ExtSemanticTokensLegend),
        languages.registerDocumentSemanticTokensProvider({language: wts.name}, wts, ExtSemanticTokensLegend),
        languages.registerDocumentSymbolProvider({language: wts.name}, wts),
        languages.registerFoldingRangeProvider({language: wts.name}, wts),
    );
}