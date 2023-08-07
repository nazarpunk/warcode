import {ExtensionContext, languages} from 'vscode'
import ExtProvider from './utils/ext-provider'
import {JassVisitor} from './jass/jass-visitor'
import {WtsParser} from './wts/wts-parser'
import {WtsVisitor} from './wts/wts-visitor'
import ExtSemanticTokensLegend from './semantic/ext-semantic-tokens-legend'
import JassParser from './jass/jass-parser'
import JassTokensList from './jass/jass-tokens-list'
import WtsTokensList from './wts/wts-tokens-list'
import ZincTokensList from './zinc/zinc-tokens-list'
import ZincParser from './zinc/zinc-parser'
import {ZincVisitor} from './zinc/zinc-visitor'
import {SlkGridEditorProvider} from './slk/slk-grid-editor-provider'

// noinspection JSUnusedGlobalSymbols
export function activate(context: ExtensionContext) {
    const jass = new ExtProvider('jass', JassTokensList, JassParser, JassVisitor)
    const zinc = new ExtProvider('zinc', ZincTokensList, ZincParser, ZincVisitor)
    const wts = new ExtProvider('wts', WtsTokensList, WtsParser, WtsVisitor)

    context.subscriptions.push(
        languages.registerDocumentSemanticTokensProvider({language: jass.languageName}, jass, ExtSemanticTokensLegend),
        languages.registerDocumentSymbolProvider({language: jass.languageName}, jass),
        languages.registerFoldingRangeProvider({language: jass.languageName}, jass),

        languages.registerDocumentSemanticTokensProvider({language: zinc.languageName}, zinc, ExtSemanticTokensLegend),

        languages.registerDocumentSemanticTokensProvider({language: wts.languageName}, wts, ExtSemanticTokensLegend),
        languages.registerDocumentSymbolProvider({language: wts.languageName}, wts),
        languages.registerFoldingRangeProvider({language: wts.languageName}, wts),

        SlkGridEditorProvider.register(context),
    )
}
