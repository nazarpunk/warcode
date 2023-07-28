import {ExtensionContext, languages} from "vscode";
import ExtProvider from "./utils/ext-provider";
import {JassVisitor} from "./jass/jass-visitor";
import {WtsParser} from "./wts/wts-parser";
import {WtsVisitor} from "./wts/wts-visitor";
import ExtSemanticTokensLegend from "./semantic/ext-semantic-tokens-legend";
import JassParser from "./jass/jass-parser";
import JassTokensList from "./jass/jass-tokens-list";
import WtsTokensList from "./wts/wts-tokens-list";
import i18next from "i18next";
import {i18n} from "./utils/i18n";

// noinspection JSUnusedGlobalSymbols
export function activate(context: ExtensionContext) {
    const jass = new ExtProvider('jass', JassTokensList, JassParser, JassVisitor);
    const wts = new ExtProvider('wts', WtsTokensList, WtsParser, WtsVisitor);

    console.log(i18next.t(i18n.stringIndexRedeclareError));

    context.subscriptions.push(
        languages.registerDocumentSemanticTokensProvider({language: jass.name}, jass, ExtSemanticTokensLegend),
        languages.registerDocumentSemanticTokensProvider({language: wts.name}, wts, ExtSemanticTokensLegend),
        languages.registerDocumentSymbolProvider({language: wts.name}, wts),
        languages.registerFoldingRangeProvider({language: wts.name}, wts),
    );
}
