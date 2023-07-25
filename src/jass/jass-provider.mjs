// noinspection NpmUsedModulesInstalled
import {DiagnosticSeverity, languages} from "vscode";
import {JassParser} from "./jass-parser.mjs";
import {JassVisitor} from "./jass-visitor.mjs";
import ITokenToRange from "../utils/i-token-to-range.mjs";
import JassParserRuleName from "./jass-parser-rule-name.mjs";
import VisitorVscodeBridge from "../utils/visitor-vscode-bridge.mjs";
import ParserErrorType from "../utils/parser-error-type.mjs";

/** @implements {import('vscode').DocumentSemanticTokensProvider} */
export default class {
    #collection = languages.createDiagnosticCollection('jass');
    #parser = new JassParser();
    #visitor = new JassVisitor();

    // noinspection JSUnusedGlobalSymbols,DuplicatedCode
    /**
     * @param {import("vscode.TextDocument")} document
     * @return {import("vscode.CancellationToken").SemanticTokens}
     */
    provideDocumentSemanticTokens(document) {
        const text = document.getText();

        this.#collection.clear();

        const bridge = new VisitorVscodeBridge();
        this.#visitor.bridge = bridge;

        this.#parser.inputText = text;

        try {
            this.#visitor.visit(this.#parser[JassParserRuleName.jass]());
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
