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
        if (!location) return;
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
        if (node = ctx[ParseRuleName.globalsdecl]) return this.visit(node);
    }

    /** @param {import('chevrotain').CstNode} ctx */
    [ParseRuleName.commentdecl](ctx) {
        const comment = ctx[JassTokenMap.comment.name]?.[0];
        this.#mark(comment, TokenLegend.jass_comment);
        return comment?.image.replace(/^\s*\/+\s*/g, '');
    }

    [ParseRuleName.terminator]() {
        return null;
    }

    [ParseRuleName.globalsdecl](ctx) {

        // TODO globals keyword
        this.#mark(ctx[JassTokenMap.globals.name]?.[0], TokenLegend.jass_local_keyword);
        this.#mark(ctx[JassTokenMap.endglobals.name]?.[0], TokenLegend.jass_local_keyword);

        ctx[ParseRuleName.commentdecl]?.map(item => this.visit(item));

        const vardecl = ctx[ParseRuleName.vardecl];

        if (vardecl) for (const vd of vardecl) {
            const typedname = this.visit(vd)?.[ParseRuleName.typedname];
            if (typedname) {
                const {type, name} = typedname;
                this.#mark(type, TokenLegend.jass_type);
                this.#mark(name, TokenLegend.jass_variable);
            }
        }

        return ctx;
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
            name: name?.image,
            arguments: this.visit(ctx[ParseRuleName.funcarglist]),
            return: this.visit(ctx[ParseRuleName.funcreturntype]),
        };
    }

    [ParseRuleName.funcdecl](ctx) {
        this.#mark(ctx[JassTokenMap.function.name]?.[0], TokenLegend.jass_function_keyword);
        this.#mark(ctx[JassTokenMap.identifier.name]?.[0], TokenLegend.jass_function);
        this.#mark(ctx[JassTokenMap.takes.name]?.[0], TokenLegend.jass_takes_keyword);
        this.#mark(ctx[JassTokenMap.returns.name]?.[0], TokenLegend.jass_returns_keyword);
        this.#mark(ctx[JassTokenMap.endfunction.name]?.[0], TokenLegend.jass_endfunction_keyword);

        this.visit(ctx[ParseRuleName.commentdecl]);

        const locals = ctx?.[ParseRuleName.localgroup];

        // argument
        /** @type {Object.<string,import('chevrotain').IToken[]>}*/
        const args = this.visit(ctx[ParseRuleName.funcarglist]);

        // locals, check locals with same name, check local redeclare argument
        if (locals) {
            /** @type {Object.<string,import('chevrotain').IToken[]>}*/
            const localMap = {};

            for (const local of locals) {
                const typedname = this.visit(local)?.[ParseRuleName.typedname];
                if (!typedname) continue;
                const {type, name} = typedname;
                this.#mark(type, TokenLegend.jass_type);
                this.#mark(name, TokenLegend.jass_variable);
                if (name) {
                    (localMap[name.image] ??= []).push(name);
                    const argList = args.map[name.image];
                    if (argList) for (const t of [name, ...argList]) {
                        this.diagnostics?.push({
                            message: `Local variable redeclare argument: ${t.image}`,
                            range: ITokenToRange(t),
                            severity: DiagnosticSeverity.Warning,
                        });
                    }
                }
            }

            for (const v of Object.values(localMap)) {
                if (v.length < 2) continue;
                for (const t of v) {
                    this.diagnostics?.push({
                        message: `Local variable with same name: ${t.image}`,
                        range: ITokenToRange(t),
                        severity: DiagnosticSeverity.Warning,
                    });
                }
            }
        }

        return {
            statement: this.visit(ctx[ParseRuleName.statement]),
            return: this.visit(ctx[ParseRuleName.funcreturntype]),
        };
    }

    [ParseRuleName.typedname](ctx) {
        const list = ctx[JassTokenMap.identifier.name];
        let [type, name] = list;
        if (type.isInsertedInRecovery) type = null;
        if (name.isInsertedInRecovery) name = null;
        return {
            type: type,
            name: name,
        };
    }

    [ParseRuleName.funcarglist](ctx) {
        let token;

        // nothing
        if (token = ctx?.[JassTokenMap.nothing.name]?.[0]) {
            this.#mark(token, TokenLegend.jass_type);
            return {map: {}, list: []};
        }

        // commas
        if (token = ctx[JassTokenMap.comma.name]) for (const comma of token) {
            this.#mark(comma, TokenLegend.jass_comma);
        }

        // args
        /** @type {import('chevrotain').IToken[][]} */
        const args = ctx?.[ParseRuleName.typedname]?.map(item => this.visit(item));

        /** @type {Object.<string,import('chevrotain').IToken[]>}*/
        const argMap = {};

        // typedname, check type same name
        if (args) {
            for (const arg of args) {
                const {type, name} = arg;
                this.#mark(type, TokenLegend.jass_type);
                this.#mark(name, TokenLegend.jass_argument);
                if (name) (argMap[name.image] ??= []).push(name);
            }

            for (const v of Object.values(argMap)) {
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

        // return
        return {
            map: argMap,
            list: args,
        };
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
        this.#mark(ctx[JassTokenMap.constant.name]?.[0], TokenLegend.jass_constant_keyword);
        this.#mark(ctx[JassTokenMap.equals.name]?.[0], TokenLegend.jass_operator);
        this.visit(ctx[ParseRuleName.commentdecl]);
        this.visit(ctx[ParseRuleName.expression]);
        return {
            [ParseRuleName.typedname]: this.visit(ctx[ParseRuleName.typedname]),
        };
    }

    [ParseRuleName.expression](ctx) {
        return this.visit(ctx[ParseRuleName.comparator]);
    }

    [ParseRuleName.comparator](ctx) {
        this.visit(ctx[ParseRuleName.addition]);
        return ctx;
    }

    [ParseRuleName.addition](ctx) {
        ctx[JassTokenMap.add.name]?.map(item => this.#mark(item, TokenLegend.jass_operator));
        ctx[JassTokenMap.sub.name]?.map(item => this.#mark(item, TokenLegend.jass_operator));
        this.visit(ctx[ParseRuleName.multiplication]);
        return ctx;
    }

    [ParseRuleName.multiplication](ctx) {
        ctx[JassTokenMap.mult.name]?.map(item => this.#mark(item, TokenLegend.jass_operator));
        ctx[JassTokenMap.div.name]?.map(item => this.#mark(item, TokenLegend.jass_operator));
        //console.log('multiplication', ctx);
        this.visit(ctx[ParseRuleName.primary]);
        return ctx;
    }

    [ParseRuleName.primary](ctx) {
        //console.log('primary', ctx);
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