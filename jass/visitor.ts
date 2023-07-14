import {SemanticTokensBuilder} from "vscode";
import {JassParser} from "./parser";
import {CstNodeLocation} from "@chevrotain/types";
import {TokenLegend} from "../src/token-legend";

const parser = new JassParser();
const ParserVisitor = parser.getBaseCstVisitorConstructor();

export class JassVisitor extends ParserVisitor {
    constructor() {
        super()
        this.validateVisitor()
    }

    builder?: SemanticTokensBuilder;

    #mark = (location: CstNodeLocation, type: TokenLegend) => {
        if (this.builder === null) return;
        if (location === undefined) return;
        this.builder?.push(
            location.startLine - 1,
            location.startColumn - 1,
            location.endColumn - location.startColumn + 1,
            type
        );
    }

    jass(ctx) {
        return ctx.statement.map(statement => this.visit(statement));
    }

    statement(ctx) {
        if (ctx.typedecl) return this.visit(ctx.typedecl);
        if (ctx.nativedecl) return this.visit(ctx.nativedecl);
        return ctx;
    }

    typedecl(ctx) {
        this.#mark(ctx.type[0], TokenLegend.keyword);
        this.#mark(ctx.extends[0], TokenLegend.keyword);
        this.#mark(ctx.identifier[0], TokenLegend.type);
        this.#mark(ctx.identifier[1], TokenLegend.type);
        return {
            type: 'typedecl',
            name: ctx.identifier[0].image,
            base: ctx.identifier[1].image,
        }
    }

    nativedecl(ctx) {
        this.#mark(ctx?.constant?.[0], TokenLegend.keyword);
        this.#mark(ctx.native[0], TokenLegend.keyword);

        //const d = ctx.native[0] as CstNodeLocation;
        //console.log(`${d.startLine}: ${d.startColumn}, ${d.endColumn}`);

        this.#mark(ctx.takes[0], TokenLegend.keyword);
        this.#mark(ctx.returns[0], TokenLegend.keyword);
        this.#mark(ctx.identifier[0], TokenLegend.function);
        return {
            type: 'nativedecl',
            arguments: this.visit(ctx.funcarglist),
            return: this.visit(ctx.funcreturntype),
        };
    }

    funcarg(ctx) {
        const t = ctx.identifier[0];
        const n = ctx.identifier[1];
        this.#mark(t, TokenLegend.typeParameter);
        this.#mark(n, TokenLegend.parameter);
        return [t.image, n.image];
    }

    funcarglist(ctx) {
        if (ctx.comma) for (const c of ctx.comma) {
            this.#mark(c, TokenLegend.operator);
        }
        if (ctx.nothing) {
            this.#mark(ctx.nothing[0], TokenLegend.type);
            return [];
        }
        return ctx.funcarg.map(funcarg => this.visit(funcarg));
    }

    funcreturntype(ctx) {
        const r = ctx.nothing ? ctx.nothing[0] : ctx.identifier[0];
        this.#mark(r, TokenLegend.type);
        return r.image;
    }
}