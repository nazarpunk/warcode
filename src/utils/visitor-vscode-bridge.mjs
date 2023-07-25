// noinspection NpmUsedModulesInstalled
import {
    SemanticTokensBuilder,
    DocumentSymbol,
    Diagnostic,
    SymbolInformation
} from 'vscode';

export default class {

    /**
     * @param {DocumentSymbol[]|SymbolInformation[]} symbols
     * @param {FoldingRange[]} foldings
     */
    constructor(symbols, foldings) {
        this.diagnostics = [];
        this.builder = new SemanticTokensBuilder();
        this.symbols = symbols;
        this.foldings = foldings;
    }

    /** @type {Diagnostic[]} */ diagnostics;
    /** @type {SemanticTokensBuilder} */ builder;
    /** @type {DocumentSymbol[]|SymbolInformation[]} */ symbols;
    /** @type {FoldingRange[]} */ foldings;

    /**
     * @param {import('chevrotain').IToken} token
     * @param {number} type
     */
    mark(token, type) {
        if (!token) return;
        this.builder.push(
            token.startLine - 1,
            token.startColumn - 1,
            token.endColumn - token.startColumn + 1,
            type
        );
    }
}