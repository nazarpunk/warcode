import {JassParser, JassParserErrorType} from "../../jass/parser.mjs";
import {JassVisitor} from "../../jass/visitor.mjs";
// noinspection NpmUsedModulesInstalled
import {DiagnosticSeverity, languages} from "vscode";
import JassSemanticHightlight from "./jass-semantic-hightlight.mjs";
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

        const highlight = new JassSemanticHightlight();
        this.#visitor.higlight = highlight;
        this.#visitor.builder = highlight.builder;

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
                    highlight.diagnostics.push({
                        message: error.type,
                        range: ITokenToRange(error.token),
                        severity: DiagnosticSeverity.Error,
                    });
                    break;
            }
        }

        if (highlight.diagnostics.length > 0) this.#collection.set(document.uri, highlight.diagnostics);

        return highlight.build();
    }
}
