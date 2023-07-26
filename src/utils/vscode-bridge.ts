import {
    SemanticTokensBuilder,
    DocumentSymbol,
    Diagnostic,
    SymbolInformation, FoldingRange
} from 'vscode';
import {IToken} from "chevrotain";

export default class VscodeBridge {

    constructor(
        symbols: DocumentSymbol[] | SymbolInformation[],
        foldings: FoldingRange[]
    ) {
        this.diagnostics = [];
        this.builder = new SemanticTokensBuilder();
        this.symbols = symbols;
        this.foldings = foldings;
    }

    diagnostics: Diagnostic[];
    builder: SemanticTokensBuilder;
    symbols: (DocumentSymbol | SymbolInformation)[];
    foldings: FoldingRange[];

    mark(token: IToken | undefined, type: number) {
        if (!token) return;
        this.builder.push(
            token.startLine! - 1,
            token.startColumn! - 1,
            token.endColumn! - token.startColumn! + 1,
            type
        );
    }
}
