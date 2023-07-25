import {ExtensionContext, languages} from "vscode";
import ExtProvider from "./utils/ext-provider";
import {JassParser} from "./jass/jass-parser";
import {JassVisitor} from "./jass/jass-visitor";
import {WtsParser} from "./wts/wts-parser";
import {WtsVisitor} from "./wts/wts-visitor";
import ExtSemanticTokensLegend from "./semantic/ext-semantic-tokens-legend";

// noinspection JSUnusedGlobalSymbols
export function activate(context: ExtensionContext) {
    const jass = new ExtProvider('jass', new JassParser(), new JassVisitor());
    const wts = new ExtProvider('wts', new WtsParser(), new WtsVisitor());

    context.subscriptions.push(
        languages.registerDocumentSemanticTokensProvider({language: jass.name}, jass, ExtSemanticTokensLegend),
        languages.registerDocumentSemanticTokensProvider({language: wts.name}, wts, ExtSemanticTokensLegend),
        languages.registerDocumentSymbolProvider({language: wts.name}, wts),
        languages.registerFoldingRangeProvider({language: wts.name}, wts),
    );
}