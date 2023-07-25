import {
    languages,
    DocumentSemanticTokensProvider,
    DocumentSymbolProvider,
    FoldingRangeProvider,
    DiagnosticCollection,
    TextDocument,
    SemanticTokens,
    DocumentSymbol,
    SymbolInformation, FoldingRange, commands, DiagnosticSeverity
} from 'vscode';
import {CstParser, ICstVisitor} from 'chevrotain'
import VisitorVscodeBridge from "./visitor-vscode-bridge";
import ITokenToRange from "./i-token-to-range";
import ParserErrorType from "./parser-error-type";

export default class ExtProvider implements DocumentSemanticTokensProvider, DocumentSymbolProvider, FoldingRangeProvider {

    constructor(name: string, parser: CstParser, visitor: ICstVisitor<any, any>) {
        this.name = name;
        this.#collection = languages.createDiagnosticCollection(name);
        this.#parser = parser;
        this.#visitor = visitor;
    }

    name: string;
    #collection: DiagnosticCollection;
    readonly #parser: CstParser;
    #visitor: ICstVisitor<any, any>;
    #version: Record<string, number> = {};
    #symbols: Record<string, DocumentSymbol[] | SymbolInformation[]> = {};
    #foldings: Record<string, FoldingRange[]> = {};

    async provideDocumentSemanticTokens(document: TextDocument): Promise<SemanticTokens> {
        const text = document.getText();

        this.#collection.clear();

        const path = document.uri.path;
        // TODO extends visitor
        const bridge = this.#visitor.bridge = new VisitorVscodeBridge(
            this.#symbols[path] = [],
            this.#foldings[path] = [],
        );

        // noinspection JSUndefinedPropertyAssignment
        this.#parser.inputText = text;

        try {
            this.#visitor.visit(this.#parser[this.name]());
        } catch (e) {
            console.error(e);
        }

        // TODO exetnd parser and release errorlist
        for (const error of this.#parser.errorlist) {
            switch (error.type) {
                case ParserErrorType.NoViableAlt:
                case ParserErrorType.MismatchToken:
                    bridge.diagnostics.push({
                        message: `Parse error: ${error.type}`,
                        range: ITokenToRange(error.token),
                        severity: DiagnosticSeverity.Error,
                    });
                    break;
            }
        }

        if (bridge.diagnostics.length > 0) this.#collection.set(document.uri, bridge.diagnostics);

        const tokens = bridge.builder.build();
        this.#version[document.uri.path] = document.version;
        return tokens;
    }

    async provideDocumentSymbols(document: TextDocument): Promise<SymbolInformation[] | DocumentSymbol[]> {
        if (document.version !== this.#version[document.uri.path]) {
            await commands.executeCommand('_provideDocumentSemanticTokens', document.uri);
        }
        return this.#symbols?.[document.uri.path];
    }

    async provideFoldingRanges(document: TextDocument): Promise<FoldingRange[]> {
        if (document.version !== this.#version[document.uri.path]) {
            await commands.executeCommand('_provideDocumentSemanticTokens', document.uri);
        }
        return this.#foldings?.[document.uri.path];
    }

}
