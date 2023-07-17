// noinspection JSAssignmentUsedAsCondition

import {JassParser} from "./parser.mjs";
import {TokenLegend} from "../src/token-legend.mjs";
import ParseRuleName from "./parse-rule-name.mjs";
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

    [ParseRuleName.jass](ctx) {
        return ctx[ParseRuleName.rootstatement].map(statement => this.visit(statement));
    }

    [ParseRuleName.rootstatement](context) {
        if (context[JassTokenMap.linebreak.name]) return null;
        let ctx;
        if (ctx = context[ParseRuleName.typedecl]) return this.visit(ctx);
        if (ctx = context[ParseRuleName.nativedecl]) return this.visit(ctx);
        if (ctx = context[JassTokenMap.linecomment.name]?.[0]) {
            this.higlight?.[JassTokenMap.linecomment.name](ctx);
            return {
                'type': JassTokenMap.linecomment.name,
                'body': ctx.image.replace(commentRegex, '')
            }
        }
    }

    [ParseRuleName.terminator]() {
        return null;
    }

    [ParseRuleName.typedecl](ctx) {
        this.higlight?.[ParseRuleName.typedecl](ctx);
        return {
            type: ParseRuleName.typedecl,
            name: ctx[JassTokenMap.identifier.name]?.[0].image,
            base: ctx[JassTokenMap.identifier.name]?.[1].image,
            comment: ctx[JassTokenMap.linecomment.name]?.[0].image.replace(commentRegex, '')
        }
    }

    [ParseRuleName.nativedecl](ctx) {
        this.higlight?.[ParseRuleName.nativedecl](ctx);
        return {
            type: ParseRuleName.nativedecl,
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