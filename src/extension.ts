import {ExtensionContext, languages} from "vscode";
import ExtProvider from "./utils/ext-provider";
import {JassVisitor} from "./jass/jass-visitor";
import {WtsParser} from "./wts/wts-parser";
import {WtsVisitor} from "./wts/wts-visitor";
import ExtSemanticTokensLegend from "./semantic/ext-semantic-tokens-legend";
import JassParser from "./jass/jass-parser";
import JassTokensList from "./jass/jass-tokens-list";
import WtsTokensList from "./wts/wts-tokens-list";
import ZincTokensList from "./zinc/zinc-tokens-list";
import ZincParser from "./zinc/zinc-parser";
import {ZincVisitor} from "./zinc/zinc-visitor";

// noinspection JSUnusedGlobalSymbols
export function activate(context: ExtensionContext) {
    const jass = new ExtProvider('jass', JassTokensList, JassParser, JassVisitor);
    const zinc = new ExtProvider('zinc', ZincTokensList, ZincParser, ZincVisitor);
    const wts = new ExtProvider('wts', WtsTokensList, WtsParser, WtsVisitor);

    context.subscriptions.push(
        languages.registerDocumentSemanticTokensProvider({language: jass.name}, jass, ExtSemanticTokensLegend),
        languages.registerDocumentSemanticTokensProvider({language: zinc.name}, zinc, ExtSemanticTokensLegend),
        languages.registerDocumentSemanticTokensProvider({language: wts.name}, wts, ExtSemanticTokensLegend),
        languages.registerDocumentSymbolProvider({language: wts.name}, wts),
        languages.registerFoldingRangeProvider({language: wts.name}, wts),
    );
}
