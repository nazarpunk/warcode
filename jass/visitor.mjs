// noinspection JSAssignmentUsedAsCondition

import {JassParser} from "./parser.mjs";
import ParseRuleName from "./parse-rule-name.mjs";
import {JassTokenMap} from "./lexer.mjs";
import {TokenLegend} from "../src/token-legend.mjs";
import ITokenToRange from "../src/utils/i-token-to-range.mjs";
// noinspection NpmUsedModulesInstalled
import {DiagnosticSeverity} from "vscode";

const parser = new JassParser();
const ParserVisitor = parser.getBaseCstVisitorConstructor();

export class JassVisitor extends ParserVisitor {
    constructor() {
        super()
        this.validateVisitor()
    }

    /** @type {import('vscode').Diagnostic[]} */ diagnostics;
    /** @type {SemanticTokensBuilder} */ builder;

    /**
     * @param {import('chevrotain').IToken} location
     * @param  {import('vscode').TokenLegend} type
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
        return ctx[ParseRuleName.rootstatement]?.map(item => this.visit(item));
    }

    [ParseRuleName.rootstatement](ctx) {
        if (ctx[JassTokenMap.linebreak.name]) return null;
        let node;
        if (node = ctx[ParseRuleName.typedecl]) return this.visit(node);
        if (node = ctx[ParseRuleName.nativedecl]) return this.visit(node);
        if (node = ctx[ParseRuleName.funcdecl]) return this.visit(node);
        if (node = ctx[ParseRuleName.commentdecl]) return this.visit(node);
    }

    /** @param {import('chevrotain').CstNode} ctx */
    [ParseRuleName.commentdecl](ctx) {
        const comment = ctx[JassTokenMap.comment.name]?.[0];
        this.#mark(comment, TokenLegend.jass_comment);
        return {
            'type': ParseRuleName.commentdecl,
            'body': comment?.image.replace(/^\s*\/+\s*/g, '')
        }
    }

    [ParseRuleName.terminator]() {
        return null;
    }

    [ParseRuleName.typedecl](ctx) {
        const name = ctx[JassTokenMap.identifier.name]?.[0];
        const base = ctx[JassTokenMap.identifier.name]?.[1];

        this.#mark(name, TokenLegend.jass_type);
        this.#mark(base, TokenLegend.jass_type);

        this.#mark(ctx[JassTokenMap.type.name]?.[0], TokenLegend.jass_type_keyword);
        this.#mark(ctx[JassTokenMap.extends.name]?.[0], TokenLegend.jass_extends_keyword);

        this.visit(ctx[ParseRuleName.commentdecl]);
        return {
            type: ParseRuleName.typedecl,
            name: name?.image,
            base: base?.image,
        }
    }

    [ParseRuleName.nativedecl](ctx) {
        const name = ctx[JassTokenMap.identifier.name]?.[0];

        this.#mark(ctx[JassTokenMap.constant.name]?.[0], TokenLegend.jass_constant_keyword);
        this.#mark(name, TokenLegend.jass_function_native);
        this.#mark(ctx[JassTokenMap.native.name]?.[0], TokenLegend.jass_native_keyword);
        this.#mark(ctx[JassTokenMap.takes.name]?.[0], TokenLegend.jass_takes_keyword);
        this.#mark(ctx[JassTokenMap.returns.name]?.[0], TokenLegend.jass_returns_keyword);

        this.visit(ctx[ParseRuleName.commentdecl]);
        return {
            type: ParseRuleName.nativedecl,
            name: name?.image,
            arguments: this.visit(ctx[ParseRuleName.funcarglist]),
            return: this.visit(ctx[ParseRuleName.funcreturntype]),
        };
    }

    [ParseRuleName.funcdecl](ctx) {
        const name = ctx[JassTokenMap.identifier.name]?.[0];

        this.#mark(ctx[JassTokenMap.function.name]?.[0], TokenLegend.jass_function_keyword);
        this.#mark(name, TokenLegend.jass_function);
        this.#mark(ctx[JassTokenMap.takes.name]?.[0], TokenLegend.jass_takes_keyword);
        this.#mark(ctx[JassTokenMap.returns.name]?.[0], TokenLegend.jass_returns_keyword);
        this.#mark(ctx[JassTokenMap.endfunction.name]?.[0], TokenLegend.jass_endfunction_keyword);

        this.visit(ctx[ParseRuleName.commentdecl]);

        const locals = ctx?.[ParseRuleName.localgroup]?.map(item => this.visit(item));
        console.log('===', locals);

        return {
            type: ParseRuleName.funcdecl,
            name: name?.image,
            locals: locals,
            statement: this.visit(ctx[ParseRuleName.statement]),
            arguments: this.visit(ctx[ParseRuleName.funcarglist]),
            return: this.visit(ctx[ParseRuleName.funcreturntype]),
        };
    }

    [ParseRuleName.funcarg](ctx) {
        const t = ctx[JassTokenMap.identifier.name];
        if (t?.length !== 2) return null;
        this.#mark(t[0], TokenLegend.jass_type);
        this.#mark(t[1], TokenLegend.jass_argument);
        return t;
    }

    [ParseRuleName.funcarglist](ctx) {
        if (ctx.nothing) return [];
        if (ctx[JassTokenMap.comma.name]) for (const comma of ctx[JassTokenMap.comma.name]) {
            this.#mark(comma, TokenLegend.jass_comma);
        }

        // check same argument name
        /** @type {import('chevrotain').IToken[][]} */
        const args = ctx?.[ParseRuleName.funcarg]?.map(item => this.visit(item));
        if (args) {
            /** @type {Object.<string,import('chevrotain').IToken[]>}*/
            const obj = {};
            for (const arg of args) {
                if (!arg || arg.length !== 2) continue;
                const [type, name] = arg;
                if (type.isInsertedInRecovery || name.isInsertedInRecovery) continue;
                (obj[name.image] ??= []).push(name);
            }

            for (const v of Object.values(obj)) {
                if (v.length < 2) continue;
                for (const t of v) {
                    this.diagnostics?.push({
                        message: `Arguments with same name: ${t.image}`,
                        range: ITokenToRange(t),
                        severity: DiagnosticSeverity.Warning,
                    });
                }
            }
        }

        // mark
        this.#mark(ctx?.[JassTokenMap.nothing.name]?.[0], TokenLegend.jass_type);

        // return
        return args;
    }

    [ParseRuleName.funcreturntype](ctx) {
        let token;

        if (token = ctx[JassTokenMap.nothing.name]?.[0]) {
            this.#mark(token, TokenLegend.jass_type);
            return token.image;
        }

        if (token = ctx[JassTokenMap.identifier.name]?.[0]) {
            this.#mark(token, TokenLegend.jass_type);
            return token.image;
        }

        return null;
    }

    [ParseRuleName.localgroup](context) {
        console.log('--localgroup', context);

        if (context[JassTokenMap.linebreak.name]) return null;
        let ctx;
        if (ctx = context[ParseRuleName.localdecl]) return this.visit(ctx);
        if (ctx = context[ParseRuleName.commentdecl]) return this.visit(ctx);
    }

    [ParseRuleName.localdecl](ctx) {
        this.#mark(ctx[JassTokenMap.local.name]?.[0], TokenLegend.jass_local_keyword);
        return this.visit(ctx[ParseRuleName.vardecl]);
    }

    [ParseRuleName.vardecl](ctx) {
        this.visit(ctx[ParseRuleName.commentdecl]);
        console.log('--vardecl', ctx);
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