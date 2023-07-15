import {JassParser} from "../jass/parser.mjs";
import {JassVisitor} from "../jass/visitor.mjs";
import {languages} from "vscode";
import SemanticHightlight from "./semantic-hightlight.mjs";

/**
 * @implements {DocumentSemanticTokensProvider}
 */
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

        const highlight = new SemanticHightlight();
        this.#visitor.higlight = highlight;
        this.#visitor.builder = highlight.builder;

        this.#parser.inputText = text;
        this.#visitor.visit(this.#parser.jass())
        //console.log(this.#parser.errorlist.length);
        //if (this.#parser.errorlist.length) return (new SemanticTokensBuilder()).build();
        //if (diagnostic.length > 0) this.#collection.set(document.uri, diagnostic);
        return highlight.build();
    }
}

/*
                   if (this.diagnostic && this.document) {
                       console.log(options.actual);
                       this.diagnostic.push({
                           message: 'cannot assign twice to immutable variable `x`',
                           range: new Range(new Position(0, 0), new Position(3, 10)),
                           severity: DiagnosticSeverity.Error,
                           source: '',
                           relatedInformation: [
                               new DiagnosticRelatedInformation(
                                   new Location(
                                       this.document.uri,
                                       new Range(
                                           new Position(1, 8),
                                           new Position(1, 9)
                                       )
                                   ),
                                   'Its WORKING!!!'
                               )
                           ]
                       });
                   } else {
                       console.error('buildMismatchTokenMessage');
                       console.log(options);
                   }

                    */