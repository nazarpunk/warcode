// noinspection JSAssignmentUsedAsCondition

import {JassParser} from "./parser.mjs";
import ParseRuleName from "./parse-rule-name.mjs";
import {JassTokenMap} from "./lexer.mjs";

const parser = new JassParser();
const ParserVisitor = parser.getBaseCstVisitorConstructor();

const commentRegex = /^\s*\/+\s*/g;

export class JassVisitor extends ParserVisitor {
    constructor() {
        super()
        this.validateVisitor()
    }

    /**  @type {JassSemanticHightlight} */ higlight;

    [ParseRuleName.jass](ctx) {
        return ctx[ParseRuleName.rootstatement]?.map(item => this.visit(item));
    }

    [ParseRuleName.rootstatement](context) {
        if (context[JassTokenMap.linebreak.name]) return null;
        let ctx;
        if (ctx = context[ParseRuleName.typedecl]) return this.visit(ctx);
        if (ctx = context[ParseRuleName.nativedecl]) return this.visit(ctx);
        if (ctx = context[ParseRuleName.funcdecl]) return this.visit(ctx);
        if (ctx = context[ParseRuleName.commentdecl]) return this.visit(ctx);
    }

    [ParseRuleName.commentdecl](ctx) {
        this.higlight?.[ParseRuleName.commentdecl](ctx);
        return {
            'type': ParseRuleName.commentdecl,
            'body': ctx[JassTokenMap.comment.name]?.[0]?.image.replace(commentRegex, '')
        }
    }

    [ParseRuleName.terminator]() {
        return null;
    }

    [ParseRuleName.typedecl](ctx) {
        this.higlight?.[ParseRuleName.typedecl](ctx);
        if (ctx[ParseRuleName.commentdecl]) this.visit(ctx[ParseRuleName.commentdecl]);
        return {
            type: ParseRuleName.typedecl,
            name: ctx[JassTokenMap.identifier.name]?.[0]?.image,
            base: ctx[JassTokenMap.identifier.name]?.[1]?.image,
        }
    }

    [ParseRuleName.nativedecl](ctx) {
        this.higlight?.[ParseRuleName.nativedecl](ctx);
        if (ctx[ParseRuleName.commentdecl]) this.visit(ctx[ParseRuleName.commentdecl]);
        return {
            type: ParseRuleName.nativedecl,
            name: ctx[JassTokenMap.identifier.name]?.[0]?.image,
            arguments: this.visit(ctx[ParseRuleName.funcarglist]),
            return: this.visit(ctx[ParseRuleName.funcreturntype]),
        };
    }

    [ParseRuleName.funcdecl](ctx) {
        this.higlight?.[ParseRuleName.funcdecl](ctx);
        if (ctx[ParseRuleName.commentdecl]) this.visit(ctx[ParseRuleName.commentdecl]);
        return {
            type: ParseRuleName.funcdecl,
            name: ctx[JassTokenMap.identifier.name]?.[0]?.image,
            locals: ctx?.[ParseRuleName.localgroup]?.map(item => this.visit(item)),
            statement: this.visit(ctx[ParseRuleName.statement]),
            arguments: this.visit(ctx[ParseRuleName.funcarglist]),
            return: this.visit(ctx[ParseRuleName.funcreturntype]),
        };
    }


    [ParseRuleName.funcarg](ctx) {
        const i = ctx[JassTokenMap.identifier.name];
        if (i?.length !== 2) return;
        this.higlight?.[ParseRuleName.funcarg](i);
        return [
            i[0].image,
            i[1].image,
        ];
    }

    [ParseRuleName.funcarglist](ctx) {
        this.higlight?.[ParseRuleName.funcarglist](ctx);
        if (ctx.nothing) return [];
        return ctx?.[ParseRuleName.funcarg]?.map(item => this.visit(item));
    }

    [ParseRuleName.funcreturntype](ctx) {
        let token;

        if (token = ctx[JassTokenMap.nothing.name]?.[0]) {
            this.higlight?.[ParseRuleName.funcreturntype](token);
            return token.image;
        }

        if (token = ctx[JassTokenMap.identifier.name]?.[0]) {
            this.higlight?.[ParseRuleName.funcreturntype](token);
            return token.image;
        }

        return null;
    }

    [ParseRuleName.localgroup](context) {
        this.higlight?.[ParseRuleName.localgroup](context);
        if (context[JassTokenMap.linebreak.name]) return null;
        let ctx;
        if (ctx = context[ParseRuleName.localdecl]) return this.visit(ctx);
        if (ctx = context[ParseRuleName.commentdecl]) return this.visit(ctx);
    }

    [ParseRuleName.localdecl](ctx) {
        return ctx;
    }

    [ParseRuleName.vardecl](ctx) {
        return ctx;
    }

    [ParseRuleName.expression](ctx) {
        return ctx;
    }

    [ParseRuleName.comparator](ctx) {
        return ctx;
    }

    [ParseRuleName.addition](ctx) {
        return ctx;
    }

    [ParseRuleName.multiplication](ctx) {
        return ctx;
    }

    [ParseRuleName.primary](ctx) {
        return ctx;
    }

    [ParseRuleName.arrayaccess](ctx) {
        return ctx;
    }

    [ParseRuleName.funccall](ctx) {
        return ctx;
    }

    [ParseRuleName.statement](ctx) {
        return ctx[ParseRuleName.localdecl]?.map(item => this.visit(item));
    }

    [ParseRuleName.callstatement](ctx) {
        return ctx;
    }

    [ParseRuleName.setstatement](ctx) {
        return ctx;
    }

    [ParseRuleName.loopstatement](ctx) {
        return ctx;
    }

    [ParseRuleName.exitwhenstatement](ctx) {
        return ctx;
    }

    [ParseRuleName.ifstatement](ctx) {
        return ctx;
    }

    [ParseRuleName.optionalelseIf](ctx) {
        return ctx;
    }

    [ParseRuleName.optionalelse](ctx) {
        return ctx;
    }
}