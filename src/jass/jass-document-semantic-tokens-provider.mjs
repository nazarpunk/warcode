import {JassParser, JassParserErrorType} from "../../jass/parser.mjs";
import {JassVisitor} from "../../jass/visitor.mjs";
import {DiagnosticSeverity, languages, Position, Range} from "vscode";
import JassSemanticHightlight from "./jass-semantic-hightlight.mjs";

/**
 * @param {import('chevrotain').IToken} token
 * @return {Range}
 */
const IToken2Range = token => new Range(
    new Position(token.startLine - 1, token.startColumn - 1),
    new Position(token.endLine - 1, token.endColumn),
);

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

        const highlight = new JassSemanticHightlight();
        this.#visitor.higlight = highlight;
        this.#visitor.builder = highlight.builder;

        this.#parser.inputText = text;
        this.#visitor.visit(this.#parser.jass())

        this.#collection.clear();

        /** @type {Diagnostic[]} */ const diagnostics = [];

        for (const error of this.#parser.errorlist) {
            switch (error.type) {
                case JassParserErrorType.MismatchToken:
                    diagnostics.push({
                        message: error.type,
                        range: IToken2Range(error.token),
                        severity: DiagnosticSeverity.Error,
                    });
                    break;
            }
        }

        if (diagnostics.length > 0) this.#collection.set(document.uri, diagnostics);

        return highlight.build();
    }
}
