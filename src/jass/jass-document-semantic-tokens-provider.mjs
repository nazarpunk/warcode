import {JassParser, JassParserErrorType} from "../../jass/parser.mjs";
import {JassVisitor} from "../../jass/visitor.mjs";
// noinspection NpmUsedModulesInstalled
import {DiagnosticSeverity, languages, SemanticTokensBuilder} from "vscode";
import ITokenToRange from "../utils/i-token-to-range.mjs";

/** @implements {DocumentSemanticTokensProvider} */
export class JassDocumentSemanticTokensProvider {
    #collection = languages.createDiagnosticCollection('jass');
    #parser = new JassParser();
    #visitor = new JassVisitor();

    onDidChangeSemanticTokens = () => {
        console.log('onDidChangeSemanticTokens');
        return null;
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {import("vscode.TextDocument")} document
     * @param {string} previousResultId
     * @param {import("vscode.CancellationToken")} token
     */
    provideDocumentSemanticTokensEdits(document, previousResultId, token) {
        console.log('provideDocumentSemanticTokensEdits', document, previousResultId, token);
    }

    // noinspection JSUnusedGlobalSymbols
    /**
     * @param {import("vscode.TextDocument")} document
     * @return {Promise<import("vscode.CancellationToken").SemanticTokens>}
     */
    async provideDocumentSemanticTokens(document) {
        console.log('provideDocumentSemanticTokens');
        const text = document.getText();

        this.#collection.clear();

        this.#visitor.builder = new SemanticTokensBuilder();
        this.#visitor.diagnostics = [];

        this.#parser.inputText = text;

        try {
            this.#visitor.visit(this.#parser.jass());
        } catch (e) {
            console.error(e);
        }

        for (const error of this.#parser.errorlist) {
            switch (error.type) {
                case JassParserErrorType.NoViableAlt:
                case JassParserErrorType.MismatchToken:
                    this.#visitor.diagnostics.push({
                        message: error.type,
                        range: ITokenToRange(error.token),
                        severity: DiagnosticSeverity.Error,
                    });
                    break;
            }
        }

        if (this.#visitor.diagnostics.length > 0) this.#collection.set(document.uri, this.#visitor.diagnostics);

        return this.#visitor.builder.build();
    }
}
