// noinspection NpmUsedModulesInstalled
import {
    languages,
    DiagnosticSeverity,
    DocumentSymbol,
    SymbolInformation,
    DocumentSemanticTokensProvider,
    DocumentSymbolProvider,
    FoldingRangeProvider,
    FoldingRange,
    commands
} from 'vscode';
import {
    CstParser,
} from 'chevrotain';

import ITokenToRange from '../utils/i-token-to-range.mjs';
import VisitorVscodeBridge from './visitor-vscode-bridge.mjs';
import ParserErrorType from './parser-error-type.mjs';

/** @implements {DocumentSemanticTokensProvider ,DocumentSymbolProvider, FoldingRangeProvider} */
export default class {

    /**
     * @param {string} name
     * @param {CstParser} parser
     * @param {import('vscode').ICstVisitor} visitor
     */
    constructor(name, {
        parser,
        visitor,
    }) {
        this.name = name;
        this.#collection = languages.createDiagnosticCollection(name);
        this.#parser = parser;
        this.#visitor = visitor;
    }

    /** @type {DiagnosticCollection} */ #collection;
    /** @type {CstParser} */ #parser;
    /** @type {import('vscode').ICstVisitor} */ #visitor;

    /** @type {Object.<string, number>} */ #version = {};

    /** @type {Object.<string, DocumentSymbol[]|SymbolInformation[]>} */ #symbols = {};
    /** @type {Object.<string, FoldingRange[]>} */ #foldings = {};


    // noinspection JSUnusedGlobalSymbols,DuplicatedCode
    /**
     * @param {import("vscode.TextDocument")} document
     * @return {import("vscode.CancellationToken").SemanticTokens}
     */
    async provideDocumentSemanticTokens(document) {
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

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {import('vscode').TextDocument} document
     * @return {import('vscode').DocumentSymbol[]|SymbolInformation[]}
     */
    async provideDocumentSymbols(document) {
        if (document.version !== this.#version[document.uri.path]) {
            await commands.executeCommand('_provideDocumentSemanticTokens', document.uri);
        }
        return this.#symbols?.[document.uri.path];
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {import('vscode').TextDocument} document
     * @return {import('vscode').FoldingRange[]}
     */
    async provideFoldingRanges(document) {
        if (document.version !== this.#version[document.uri.path]) {
            await commands.executeCommand('_provideDocumentSemanticTokens', document.uri);
        }
        return this.#foldings?.[document.uri.path];
    }

}
