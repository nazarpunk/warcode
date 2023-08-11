import {ExtensionContext, languages, window} from 'vscode'
import ExtProvider from './utils/ext-provider'
import ExtSemanticTokensLegend from './semantic/ext-semantic-tokens-legend'
import JassTokensList from './jass/jass-tokens-list'
import JassParser from './jass/jass-parser'
import JassVisitor from './jass/jass-visitor'
import ZincTokensList from './zinc/zinc-tokens-list'
import ZincParser from './zinc/zinc-parser'
import ZincVisitor from './zinc/zinc-visitor'
import WtsTokensList from './wts/wts-tokens-list'
import WtsParser from './wts/wts-parser'
import WtsVisitor from './wts/wts-visitor'
import SlkTableEditorProvider from './slk/slk-table-editor-provider'
import {BinaryEditorProvider} from './binary/binary-editor-provider'

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

        window.registerCustomEditorProvider('SlkTable', new SlkTableEditorProvider(context)),
        window.registerCustomEditorProvider(
            'BinaryEditor',
            new BinaryEditorProvider(context),
            {
                webviewOptions: {
                    retainContextWhenHidden: true,
                },
                supportsMultipleEditorsPerDocument: false,
            },
        ),
    )
}
