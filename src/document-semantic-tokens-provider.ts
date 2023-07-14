import {
    CancellationToken,
    DocumentSemanticTokensProvider,
    languages, ProviderResult,
    SemanticTokens,
    SemanticTokensBuilder, SemanticTokensEdits,
    TextDocument
} from "vscode";
import {JassParser} from "../jass/parser";
import {JassVisitor} from "../jass/visitor";

export class JassDocumentSemanticTokensProvider implements DocumentSemanticTokensProvider {
    #collection = languages.createDiagnosticCollection('jass');
    #parser = new JassParser();
    #visitor = new JassVisitor();

    onDidChangeSemanticTokens = () => {
        console.log('onDidChangeSemanticTokens');
        return null;
    }

    provideDocumentSemanticTokensEdits?(document: TextDocument, previousResultId: string, token: CancellationToken): ProviderResult<SemanticTokens | SemanticTokensEdits> {
        console.log('provideDocumentSemanticTokensEdits');
        return null;
    }

    // noinspection JSUnusedGlobalSymbols
    async provideDocumentSemanticTokens(document: TextDocument, token: CancellationToken): Promise<SemanticTokens> {
        console.log('provideDocumentSemanticTokens');
        const text = document.getText();
        this.#collection.clear();

        this.#visitor.builder = new SemanticTokensBuilder();

        this.#parser.inputText = text;

        this.#visitor.visit(this.#parser.jass());
        //console.log();

        //if (diagnostic.length > 0) this.#collection.set(document.uri, diagnostic);
        return this.#visitor.builder.build();
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