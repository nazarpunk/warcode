// noinspection NpmUsedModulesInstalled
import {SemanticTokensBuilder} from "vscode";

export default class {

    constructor() {
        this.diagnostics = [];
        this.builder = new SemanticTokensBuilder()
    }

    /** @type {import('vscode').Diagnostic[]} */ diagnostics;
    /** @type {SemanticTokensBuilder} */ builder;

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