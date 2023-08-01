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
    DiagnosticSeverity,
    Range, SemanticTokensBuilder, Diagnostic
} from 'vscode'
import {CstParser, ICstVisitor, Lexer} from 'chevrotain'
import {IParserConfig, TokenType} from '@chevrotain/types'
import i18next from 'i18next'
import {i18n} from './i18n'
import TokenLegend from '../semantic/token-legend'

interface IParserConstructor {
    new(config?: IParserConfig): CstParser;
}

export interface IVisitor extends ICstVisitor<any, any> {
    document: TextDocument
    builder: SemanticTokensBuilder
    diagnostics: Diagnostic[]
    symbols: DocumentSymbol[] | SymbolInformation[]
    foldings: FoldingRange[]
}

interface IVisitorConstructor {
    new(): IVisitor
}

const documentMap: Record<string, DocumentHolder> = {}

class DocumentHolder {
    static get(
        languageName: string,
        document: TextDocument,
        lexerDefinition: TokenType[],
        parserConstructor: IParserConstructor,
        visitorConstructor: IVisitorConstructor
    ): DocumentHolder {
        const path = document.uri.path
        const isset = !!documentMap[path]
        const holder = documentMap[path] ??= new DocumentHolder()
        holder.document = document
        if (!isset) {
            holder.languageName = languageName

            holder.lexer = new Lexer(lexerDefinition, {
                recoveryEnabled: true,
                skipValidations: true,
                deferDefinitionErrorsHandling: true,
                positionTracking: 'onlyOffset',
                errorMessageProvider: {
                    buildUnexpectedCharactersMessage: (): string => i18next.t(i18n.unexpectedCharacter),
                    buildUnableToPopLexerModeMessage: (): string => i18next.t(i18n.unableToPopLexerMode),
                },
            })

            holder.parser = new parserConstructor({
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

            holder.visitor = new visitorConstructor()

            holder.collection = languages.createDiagnosticCollection(path)
        }
        return holder
    }

    declare version: number
    declare languageName: string
    declare document: TextDocument
    declare lexer: Lexer
    declare parser: CstParser
    declare visitor: IVisitor
    declare collection: DiagnosticCollection
    declare semanticTokensBuilder: SemanticTokensBuilder
    declare semanticTokens: SemanticTokens
    declare diagnostics: Diagnostic[]
    declare symbols: SymbolInformation[]
    declare foldings: FoldingRange[]

    process() {
        if (this.version === this.document.version) return

        //=== settings
        const text = this.document.getText()
        this.symbols = []
        this.diagnostics = []
        this.foldings = []
        this.semanticTokensBuilder = new SemanticTokensBuilder()

        //===  lexing
        const lexing = this.lexer.tokenize(text)

        for (const error of lexing.errors) {
            this.diagnostics.push({
                message: error.message,
                range: new Range(
                    this.document.positionAt(error.offset),
                    this.document.positionAt(error.offset + error.length)
                ),
                severity: DiagnosticSeverity.Error,
            })
        }

        const comments = lexing.groups['comments']
        if (comments) for (const comment of comments) {
            const p = this.document.positionAt(comment.startOffset)
            this.semanticTokensBuilder.push(p.line, p.character, comment.image.length, TokenLegend.jass_comment)
        }

        // === parsing
        this.parser.input = lexing.tokens
        // @ts-ignore
        const parsing = this.parser[this.languageName]()
        for (const error of this.parser.errors) {
            this.diagnostics.push({
                message: error.message,
                range: new Range(
                    this.document.positionAt(error.token.startOffset),
                    this.document.positionAt(error.token.startOffset + error.token.image.length),
                ),
                severity: DiagnosticSeverity.Error,
            })
        }

        // === visiting
        this.visitor.document = this.document
        this.visitor.builder = this.semanticTokensBuilder
        this.visitor.diagnostics = this.diagnostics
        this.visitor.symbols = this.symbols
        this.visitor.foldings = this.foldings
        this.visitor.visit(parsing)

        if (this.diagnostics.length > 0) this.collection.set(this.document.uri, this.diagnostics)
        else this.collection.clear()

        this.semanticTokens = this.semanticTokensBuilder.build()

        // === version
        this.version = this.document.version
    }

}

export default class ExtProvider implements DocumentSemanticTokensProvider, DocumentSymbolProvider, FoldingRangeProvider {
    constructor(
        languageName: string,
        lexerDefinition: TokenType[],
        parserConstructor: IParserConstructor,
        visitorConstructor: IVisitorConstructor
    ) {
        this.languageName = languageName
        this.#lexerDefinition = lexerDefinition
        this.#parserConstructor = parserConstructor
        this.#visitorConstructor = visitorConstructor
    }

    readonly languageName: string
    readonly #lexerDefinition: TokenType[]
    readonly #parserConstructor: IParserConstructor
    readonly #visitorConstructor: IVisitorConstructor

    #holder(document: TextDocument): DocumentHolder {
        const holder = DocumentHolder.get(
            this.languageName,
            document,
            this.#lexerDefinition,
            this.#parserConstructor,
            this.#visitorConstructor,
        )
        holder.process()
        return holder
    }

    async provideDocumentSemanticTokens(document: TextDocument): Promise<SemanticTokens> {
        return new Promise<SemanticTokens>(resolve => resolve(this.#holder(document).semanticTokens))
    }

    async provideDocumentSymbols(document: TextDocument): Promise<SymbolInformation[] | DocumentSymbol[]> {
        return new Promise<SymbolInformation[] | DocumentSymbol[]>(resolve => resolve(this.#holder(document).symbols))
    }

    async provideFoldingRanges(document: TextDocument): Promise<FoldingRange[]> {
        return new Promise<FoldingRange[]>(resolve => resolve(this.#holder(document).foldings))
    }
}
