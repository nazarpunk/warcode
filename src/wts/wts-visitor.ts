import {DiagnosticSeverity, FoldingRange, FoldingRangeKind, SymbolInformation, SymbolKind} from 'vscode';
import {WtsParser} from './wts-parser';
import ITokenToRange from '../utils/i-token-to-range';
import ITokenToRangeMerge from "../utils/i-token-to-range-merge";
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

        for (const tokens of Object.values(indexMap)) {
            if (tokens.length < 2) continue;
            for (const token of tokens) {
                this.bridge?.diagnostics.push({
                    message: `String index redeclared: ${token.image}`,
                    range: ITokenToRange(token),
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
                b.symbols.push(new SymbolInformation(
                    `${string.image} ${index.image}`,
                    SymbolKind.String,
                    ITokenToRangeMerge(string, rparen),
                ));

                b.foldings.push(new FoldingRange(
                    string.startLine! - 1,
                    rparen.startLine! - 1,
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
