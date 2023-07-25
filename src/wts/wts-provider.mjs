// noinspection NpmUsedModulesInstalled
import {DiagnosticSeverity, languages, DocumentSymbol, SymbolInformation, commands} from "vscode";
import ITokenToRange from "../utils/i-token-to-range.mjs";
import {WtsParser} from "./wts-parser.mjs";
import {WtsVisitor} from "./wts-visitor.mjs";
import WtsParserRuleName from "./wts-parser-rule-name.mjs";
import VisitorVscodeBridge from "../utils/visitor-vscode-bridge.mjs";
import ParserErrorType from "../utils/parser-error-type.mjs";

/** @implements {
 * import('vscode').DocumentSemanticTokensProvider,
 * import('vscode').DocumentSymbolProvider
 * } */
export default class {
    #collection = languages.createDiagnosticCollection('wts');
    #parser = new WtsParser();
    #visitor = new WtsVisitor();

    /** @type {Object.<string, import('vscode').DocumentSymbol[]|SymbolInformation[]>} */
    #symbols = {};
    /** @type {Object.<string, number>} */
    #version = {};

    // noinspection JSUnusedGlobalSymbols,DuplicatedCode
    /**
     * @param {import("vscode.TextDocument")} document
     * @return {import("vscode.CancellationToken").SemanticTokens}
     */
    async provideDocumentSemanticTokens(document) {
        const text = document.getText();

        this.#collection.clear();

        const bridge = new VisitorVscodeBridge(this.#symbols[document.uri.path] = []);
        this.#visitor.bridge = bridge;

        this.#parser.inputText = text;

        try {
            this.#visitor.visit(this.#parser[WtsParserRuleName.wts]());
        } catch (e) {
            console.error(e);
        }

        // noinspection DuplicatedCode
        for (const error of this.#parser.errorlist) {
            switch (error.type) {
                case ParserErrorType.NoViableAlt:
                case ParserErrorType.MismatchToken:
                    bridge.diagnostics.push({
                        message: error.type,
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
        return this.#symbols[document.uri.path] ?? [];
    }
}
