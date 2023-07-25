// noinspection NpmUsedModulesInstalled
import {DiagnosticSeverity, FoldingRange, SymbolInformation, SymbolKind} from 'vscode';
import {WtsParser} from './wts-parser.mjs';
import Rule from './wts-parser-rule-name.mjs';
import {WtsTokenMap} from './wts-lexer.mjs';
import ITokenToRange from '../utils/i-token-to-range.mjs';
import ITokenToRangeMerge from "../utils/i-token-to-range-merge.mjs";
import TokenLegend from "../semantic/token-legend.mjs";

const parser = new WtsParser();

const BaseCstVisitor = parser.getBaseCstVisitorConstructor();

export class WtsVisitor extends BaseCstVisitor {
    constructor() {
        super();
        this.validateVisitor();
    }

    /** @type {import('../utils/visitor-vscode-bridge.mjs').default} */ bridge;

    [Rule.wts](ctx) {
        //console.log(Rule.wts, ctx);
        const blocks = ctx[Rule.block];
        /** @type {Object.<string,import('chevrotain').IToken[]>}*/
        const indexMap = {};
        if (blocks) for (const item of blocks) {
            const block = this.visit(item);
            /** @type {import('chevrotain').IToken}*/
            const index = block.index;
            if (index) {
                (indexMap[index.image] ??= []).push(index);
            }
        }

        for (const tokens of Object.values(indexMap)) {
            if (tokens.length < 2) continue;
            for (const token of tokens) this.bridge?.diagnostics.push({
                message: `String index redeclared: ${token.image}`,
                range: ITokenToRange(token),
                severity: DiagnosticSeverity.Warning,
            });
        }

        return null;
    }

    [Rule.block](ctx) {
        //console.log(Rule.block, ctx);

        const index = ctx[WtsTokenMap.index.name]?.[0];

        const b = this?.bridge;
        if (b) {
            /** @type {IToken} */ const string = ctx[WtsTokenMap.string.name]?.[0];
            /** @type {IToken} */ const rparen = ctx[WtsTokenMap.rparen.name]?.[0];

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
                    string.startLine - 1,
                    rparen.startLine - 1,
                    3
                ));

            }
            b.mark(ctx[WtsTokenMap.lparen.name]?.[0], TokenLegend.wts_paren);
            ctx[WtsTokenMap.comment.name]?.map(item => b.mark(item, TokenLegend.wts_comment));
        }

        return {
            index: index,
        };
    }
}