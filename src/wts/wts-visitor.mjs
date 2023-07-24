// noinspection NpmUsedModulesInstalled
import {DiagnosticSeverity} from 'vscode';
import {WtsParser} from './wts-parser.mjs';
import Rule from './wts-parser-rule-name.mjs';
import JassTokenLegend from '../jass/lexer/jass-token-legend.mjs';
import {WtsTokenMap} from './wts-lexer.mjs';
import ITokenToRange from '../utils/i-token-to-range.mjs';

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
        ctx[Rule.block]?.map(item => this.visit(item));
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

        this?.bridge?.mark(index, JassTokenLegend.wts_index);
        this?.bridge?.mark(ctx[WtsTokenMap.string.name]?.[0], JassTokenLegend.wts_string);
        this?.bridge?.mark(ctx[WtsTokenMap.lparen.name]?.[0], JassTokenLegend.wts_paren);
        this?.bridge?.mark(ctx[WtsTokenMap.rparen.name]?.[0], JassTokenLegend.wts_paren);
        //this?.bridge?.mark(ctx[WtsTokenMap.text.name]?.[0], JassTokenLegend.wts_text);
        ctx[WtsTokenMap.comment.name]?.map(item => this?.bridge?.mark(item, JassTokenLegend.wts_comment));

        return {
            index: index,
        };
    }
}