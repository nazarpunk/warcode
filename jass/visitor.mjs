// noinspection JSAssignmentUsedAsCondition

import {JassParser} from "./parser.mjs";
import {TokenLegend} from "../src/token-legend.mjs";
import ParseRule from "./parse-rule.mjs";
import {JassTokenMap} from "./lexer.mjs";

const parser = new JassParser();
const ParserVisitor = parser.getBaseCstVisitorConstructor();

const commentRegex = /^\s*\/\/\s*/g;

export class JassVisitor extends ParserVisitor {
    constructor() {
        super()
        this.validateVisitor()
    }

    /**  @type {JassSemanticHightlight} */ higlight;

    /**
     * @param {import("chevrotain").IToken} location
     * @param  {import("vscode").TokenLegend} type
     * @deprecated
     */
    #mark = (location, type) => {
        if (this.builder === null) return;
        if (location === undefined) return;
        this.builder?.push(
            location.startLine - 1,
            location.startColumn - 1,
            location.endColumn - location.startColumn + 1,
            type
        );
    }

    [ParseRule.jass](ctx) {
        return ctx[ParseRule.rootstatement].map(statement => this.visit(statement));
    }

    [ParseRule.rootstatement](context) {
        if (context[JassTokenMap.linebreak.name]) return null;
        let ctx;
        if (ctx = context[ParseRule.typedecl]) return this.visit(ctx);
        if (ctx = context[ParseRule.nativedecl]) return this.visit(ctx);
        if (ctx = context[JassTokenMap.linecomment.name]?.[0]) {
            this.higlight?.[JassTokenMap.linecomment.name](ctx);
            return {
                'type': JassTokenMap.linecomment.name,
                'body': ctx.image.replace(commentRegex, '')
            }
        }
    }

    [ParseRule.terminator]() {
        return null;
    }

    [ParseRule.typedecl](ctx) {
        this.higlight?.[ParseRule.typedecl](ctx);
        return {
            type: ParseRule.typedecl,
            name: ctx[JassTokenMap.identifier.name]?.[0].image,
            base: ctx[JassTokenMap.identifier.name]?.[1].image,
            comment: ctx[JassTokenMap.linecomment.name]?.[0].image.replace(commentRegex, '')
        }
    }

    nativedecl(ctx) {
        this.#mark(ctx?.constant?.[0], TokenLegend.jass_constant_keyword);
        this.#mark(ctx.native[0], TokenLegend.jass_native_keyword);
        this.#mark(ctx.identifier[0], TokenLegend.jass_function);
        this.#mark(ctx.takes[0], TokenLegend.jass_takes_keyword);
        this.#mark(ctx.returns[0], TokenLegend.jass_returns_keyword);
        return {
            type: 'nativedecl',
            arguments: this.visit(ctx.funcarglist),
            return: this.visit(ctx.funcreturntype),
        };
    }

    funcarg(ctx) {
        const t = ctx.identifier[0];
        const n = ctx.identifier[1];
        this.#mark(t, TokenLegend.jass_type);
        this.#mark(n, TokenLegend.jass_argument);
        return [t.image, n.image];
    }

    funcarglist(ctx) {
        if (ctx.comma) for (const c of ctx.comma) {
            this.#mark(c, TokenLegend.jass_comma);
        }
        if (ctx.nothing) {
            this.#mark(ctx.nothing[0], TokenLegend.jass_type);
            return [];
        }
        return ctx.funcarg.map(funcarg => this.visit(funcarg));
    }

    funcreturntype(ctx) {
        const r = ctx.nothing ? ctx.nothing[0] : ctx.identifier[0];
        this.#mark(r, TokenLegend.jass_type);
        return r.image;
    }
}