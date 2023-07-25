// noinspection NpmUsedModulesInstalled
import {SemanticTokensBuilder} from "vscode";

export default class {

    /** @param {import('vscode').DocumentSymbol[]|SymbolInformation[]} symbols */
    constructor(symbols) {
        this.diagnostics = [];
        this.builder = new SemanticTokensBuilder();
        this.symbols = symbols;
    }

    /** @type {import('vscode').Diagnostic[]} */ diagnostics;
    /** @type {SemanticTokensBuilder} */ builder;
    /** @type {import('vscode').DocumentSymbol[]|SymbolInformation[]} */ symbols;

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