// noinspection NpmUsedModulesInstalled
import {DiagnosticSeverity, languages} from "vscode";
import ITokenToRange from "../utils/i-token-to-range.mjs";
import {WtsParser} from "./wts-parser.mjs";
import {WtsVisitor} from "./wts-visitor.mjs";
import WtsParserRuleName from "./wts-parser-rule-name.mjs";
import VisitorVscodeBridge from "../utils/visitor-vscode-bridge.mjs";
import ParserErrorType from "../utils/parser-error-type.mjs";

/** @implements {DocumentSemanticTokensProvider} */
export default class {
    #collection = languages.createDiagnosticCollection('wts');
    #parser = new WtsParser();
    #visitor = new WtsVisitor();

    // noinspection JSUnusedGlobalSymbols
    onDidChangeSemanticTokens = () => {
        //console.log('onDidChangeSemanticTokens');
        return null;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {import("vscode.TextDocument")} document
     * @param {string} previousResultId
     * @param {import("vscode.CancellationToken")} token
     */
    provideDocumentSemanticTokensEdits(document, previousResultId, token) {
        //console.log('provideDocumentSemanticTokensEdits', document, previousResultId, token);
    }

    // noinspection JSUnusedGlobalSymbols,DuplicatedCode
    /**
     * @param {import("vscode.TextDocument")} document
     * @return {Promise<import("vscode.CancellationToken").SemanticTokens>}
     */
    async provideDocumentSemanticTokens(document) {
        const text = document.getText();

        this.#collection.clear();

        const bridge = new VisitorVscodeBridge();
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

        return bridge.builder.build();
    }
}
