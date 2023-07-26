import {
    DiagnosticSeverity,
    FoldingRange,
    FoldingRangeKind,
    Location,
    Range,
    SymbolInformation,
    SymbolKind
} from 'vscode';
import {WtsParser} from './wts-parser';
import TokenLegend from "../semantic/token-legend";
import {IToken} from "@chevrotain/types";
import WtsRule from "./wts-rule";
import VscodeBridge from "../utils/vscode-bridge";
import WtsCstNode from "./wts-cst-node";

const parser = new WtsParser();

const BaseCstVisitor = parser.getBaseCstVisitorConstructor();

export class WtsVisitor extends BaseCstVisitor {
    constructor() {
        super();
        this.validateVisitor();
    }

    bridge?: VscodeBridge;

    [WtsRule.wts](ctx: WtsCstNode) {
        //console.log(Rule.wts, ctx);
        const blocks = ctx[WtsRule.block];
        const indexMap: Record<string, IToken[]> = {};
        if (blocks) {
            for (const item of blocks) {
                const block = this.visit(item);
                const index: IToken = block.index;
                if (index) {
                    (indexMap[index.image] ??= []).push(index);
                }
            }
        }

        const b = this.bridge;

        if (b) for (const tokens of Object.values(indexMap)) {
            if (tokens.length < 2) continue;
            for (const token of tokens) {
                b.diagnostics.push({
                    message: `String index redeclared: ${token.image}`,
                    range: new Range(
                        b.document.positionAt(token.startOffset),
                        b.document.positionAt(token.startOffset + token.image.length)
                    ),
                    severity: DiagnosticSeverity.Warning,
                });
            }
        }

        return null;
    }

    [WtsRule.block](ctx: WtsCstNode) {
        //console.log(Rule.block, ctx);
        const index = ctx[WtsRule.index]?.[0];

        const b = this?.bridge;
        if (b) {
            const string = ctx[WtsRule.string]?.[0];
            const rparen = ctx[WtsRule.rparen]?.[0];

            if (index && string && rparen) {
                b.mark(index, TokenLegend.wts_index);
                b.mark(string, TokenLegend.wts_string);
                b.mark(rparen, TokenLegend.wts_paren);

                const start = b.document.positionAt(string.startOffset);
                const end = b.document.positionAt(rparen.startOffset + 1);

                b.symbols.push(new SymbolInformation(
                    `${string.image} ${index.image}`,
                    SymbolKind.String,
                    '',
                    new Location(b.document.uri, new Range(start, end)
                    ),
                ));

                b.foldings.push(new FoldingRange(
                    start.line,
                    end.line,
                    FoldingRangeKind.Region,
                ));
            }
            b.mark(ctx[WtsRule.lparen]?.[0], TokenLegend.wts_paren);
            ctx[WtsRule.comment]?.map(item => b.mark(item, TokenLegend.wts_comment));
        }

        return {
            index: index,
        };
    }
}
