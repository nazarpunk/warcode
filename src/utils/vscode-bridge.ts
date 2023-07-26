import {
    SemanticTokensBuilder,
    DocumentSymbol,
    Diagnostic,
    SymbolInformation, FoldingRange, TextDocument
} from 'vscode';
import {IToken} from "chevrotain";

export default class VscodeBridge {

    constructor(
        document: TextDocument,
        symbols: DocumentSymbol[] | SymbolInformation[],
        foldings: FoldingRange[]
    ) {
        this.document = document;
        this.diagnostics = [];
        this.builder = new SemanticTokensBuilder();
        this.symbols = symbols;
        this.foldings = foldings;
    }

    document: TextDocument;
    diagnostics: Diagnostic[];
    builder: SemanticTokensBuilder;
    symbols: (DocumentSymbol | SymbolInformation)[];
    foldings: FoldingRange[];

    mark(token: IToken | undefined, type: number) {
        if (!token) return;

        const p = this.document.positionAt(token.startOffset);
        this.builder.push(
            p.line,
            p.character,
            token.image.length,
            type
        );
    }
}
