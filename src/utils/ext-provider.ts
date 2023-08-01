import {
    languages,
    DocumentSemanticTokensProvider,
    DocumentSymbolProvider,
    FoldingRangeProvider,
    DiagnosticCollection,
    TextDocument,
    SemanticTokens,
    DocumentSymbol,
    SymbolInformation,
    FoldingRange,
    commands,
    DiagnosticSeverity,
    CancellationToken,
    Range
} from 'vscode'
import {CstParser, ICstVisitor, Lexer} from 'chevrotain'
import VscodeBridge from './vscode-bridge'
import {IParserConfig, TokenType} from '@chevrotain/types'
import i18next from 'i18next'
import {i18n} from './i18n'
import TokenLegend from '../semantic/token-legend'

interface IParserConstructor {
    new(config?: IParserConfig): CstParser;
}

interface IVisitorConstructor {
    new(): IVisitor;
}

interface IVisitor extends ICstVisitor<any, any> {
    bridge?: VscodeBridge,
}

export default class ExtProvider implements DocumentSemanticTokensProvider, DocumentSymbolProvider, FoldingRangeProvider {

    constructor(name: string, lexerDefinition: TokenType[], parser: IParserConstructor, visitor: IVisitorConstructor) {
        this.name = name
        this.#parser = parser
        this.#lexerDefinition = lexerDefinition
        this.#visitor = visitor
    }

    name: string
    #collections: Record<string, DiagnosticCollection> = {}

    readonly #lexerDefinition: TokenType[]
    #lexers: Record<string, Lexer> = {}

    readonly #parser: IParserConstructor
    #parsers: Record<string, CstParser> = {}

    readonly #visitor: IVisitorConstructor

    #versions: Record<string, number> = {}
    #symbols: Record<string, DocumentSymbol[] | SymbolInformation[]> = {}
    #foldings: Record<string, FoldingRange[]> = {}

    //async provideDocumentSemanticTokens(document: vscode.TextDocument, token: vscode.CancellationToken): Promise<vscode.SemanticTokens>
    async provideDocumentSemanticTokens(document: TextDocument, token: CancellationToken): Promise<SemanticTokens> {
        return new Promise<SemanticTokens>(resolve => {
            const now = performance.now()

            //=== cancelation
            token.onCancellationRequested(resolve)

            //=== settings
            const path = document.uri.path
            const text = document.getText()
            const bridge = new VscodeBridge(
                document,
                this.#symbols[path] = [],
                this.#foldings[path] = [],
            )

            //===  lexing
            const lexer = this.#lexers[path] ??= new Lexer(this.#lexerDefinition, {
                recoveryEnabled: true,
                skipValidations: true,
                deferDefinitionErrorsHandling: true,
                positionTracking: 'onlyOffset',
                errorMessageProvider: {
                    buildUnexpectedCharactersMessage: (): string => i18next.t(i18n.unexpectedCharacter),
                    buildUnableToPopLexerModeMessage: (): string => i18next.t(i18n.unableToPopLexerMode),
                },

            })
            const lexing = lexer.tokenize(text)

            for (const error of lexing.errors) {
                bridge.diagnostics.push({
                    message: error.message,
                    range: new Range(
                        document.positionAt(error.offset),
                        document.positionAt(error.offset + error.length)
                    ),
                    severity: DiagnosticSeverity.Error,
                })
            }

            const comments = lexing.groups['comments']
            if (comments) for (const comment of comments) bridge.mark(comment, TokenLegend.jass_comment)

            //=== parsing
            const parser = this.#parsers[path] ??= new this.#parser({
                recoveryEnabled: true,
                skipValidations: true,
                nodeLocationTracking: 'onlyOffset',
                errorMessageProvider: {
                    buildMismatchTokenMessage: (): string => i18next.t(i18n.mismatchToken),
                    buildNotAllInputParsedMessage: (): string => i18next.t(i18n.notAllInputParsed),
                    buildNoViableAltMessage: (): string => i18next.t(i18n.noViableAlt),
                    buildEarlyExitMessage: (): string => i18next.t(i18n.earlyExit),
                }
            })
            parser.input = lexing.tokens
            // @ts-ignore
            const parsing = parser[this.name]()
            for (const error of parser.errors) {
                bridge.diagnostics.push({
                    message: error.message,
                    range: new Range(
                        document.positionAt(error.token.startOffset),
                        document.positionAt(error.token.startOffset + error.token.image.length),
                    ),
                    severity: DiagnosticSeverity.Error,
                })
            }

            //=== visitor
            const visitor = new this.#visitor()
            visitor.bridge = bridge
            visitor.visit(parsing)

            const collection = this.#collections[path] ??= languages.createDiagnosticCollection(this.name)
            if (bridge.diagnostics.length > 0) collection.set(document.uri, bridge.diagnostics)
            else collection.clear()

            //=== resolve
            this.#versions[path] = document.version
            resolve(bridge.builder.build())
            console.log(performance.now() - now)
        })
    }

    async provideDocumentSymbols(document: TextDocument): Promise<SymbolInformation[] | DocumentSymbol[]> {
        if (document.version !== this.#versions[document.uri.path]) await commands.executeCommand('_provideDocumentSemanticTokens', document.uri)
        return this.#symbols?.[document.uri.path]
    }

    async provideFoldingRanges(document: TextDocument): Promise<FoldingRange[]> {
        if (document.version !== this.#versions[document.uri.path]) await commands.executeCommand('_provideDocumentSemanticTokens', document.uri)
        return this.#foldings?.[document.uri.path]
    }

}
