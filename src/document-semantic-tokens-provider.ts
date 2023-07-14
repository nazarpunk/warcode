import {CancellationToken, Diagnostic, languages, SemanticTokens, SemanticTokensBuilder, TextDocument} from "vscode";
import {JassParser} from "../jass/parser";
import {JassVisitor} from "../jass/visitor";

export class DocumentSemanticTokensProvider implements DocumentSemanticTokensProvider {
    #collection = languages.createDiagnosticCollection('jass');
    #parser = new JassParser();
    #visitor = new JassVisitor();

    // noinspection JSUnusedGlobalSymbols
    async provideDocumentSemanticTokens(document: TextDocument, token: CancellationToken): Promise<SemanticTokens> {
        token.onCancellationRequested(() => {
            console.error('------');
        });

        const text = document.getText();
        const builder = new SemanticTokensBuilder();
        this.#collection.clear();

        this.#parser.inputText = text;
        this.#visitor.builder = builder;
        this.#visitor.visit(this.#parser.jass());
        //console.log();

        //if (diagnostic.length > 0) this.#collection.set(document.uri, diagnostic);
        return builder.build();
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