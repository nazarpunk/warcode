// noinspection JSAssignmentUsedAsCondition

import {JassParser} from "./parser.mjs";
import ParseRuleName from "./parse-rule-name.mjs";
import ITokenToRange from "../src/utils/i-token-to-range.mjs";
// noinspection NpmUsedModulesInstalled
import {DiagnosticSeverity} from "vscode";
import JassTokenMap from "./lexer/jass-token-map.mjs";
import JassTokenLegend from "./lexer/jass-token-legend.mjs";

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
     * @param  {import('vscode').JassTokenLegend} type
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
        if (node = ctx[ParseRuleName.commentdecl]) return this.visit(node);
        if (node = ctx[ParseRuleName.typedecl]) return this.visit(node);
        if (node = ctx[ParseRuleName.nativedecl]) return this.visit(node);
        if (node = ctx[ParseRuleName.funcdecl]) return this.visit(node);
        if (node = ctx[ParseRuleName.globalsdecl]) return this.visit(node);
    }

    /** @param {import('chevrotain').CstNode} ctx */
    [ParseRuleName.commentdecl](ctx) {
        const comment = ctx[JassTokenMap.comment.name]?.[0];
        this.#mark(comment, JassTokenLegend.jass_comment);
        return comment?.image.replace(/^\s*\/+\s*/g, '');
    }

    [ParseRuleName.terminator]() {
        return null;
    }

    [ParseRuleName.globalsdecl](ctx) {
        this.#mark(ctx[JassTokenMap.globals.name]?.[0], JassTokenLegend.jass_globals);
        this.#mark(ctx[JassTokenMap.endglobals.name]?.[0], JassTokenLegend.jass_endglobals);

        ctx[ParseRuleName.commentdecl]?.map(item => this.visit(item));

        const vardecl = ctx[ParseRuleName.vardecl];

        if (vardecl) for (const vd of vardecl) {
            const typedname = this.visit(vd)?.[ParseRuleName.typedname];
            if (typedname) {
                const {type, name} = typedname;
                this.#mark(type, JassTokenLegend.jass_type_name);
                this.#mark(name, JassTokenLegend.jass_variable);
            }
        }

        return ctx;
    }

    [ParseRuleName.typedecl](ctx) {
        const name = ctx[JassTokenMap.identifier.name]?.[0];
        const base = ctx[JassTokenMap.identifier.name]?.[1];

        this.#mark(name, JassTokenLegend.jass_type_name);
        this.#mark(base, JassTokenLegend.jass_type_name);

        this.#mark(ctx[JassTokenMap.type.name]?.[0], JassTokenLegend.jass_type);
        this.#mark(ctx[JassTokenMap.extends.name]?.[0], JassTokenLegend.jass_extends);

        this.visit(ctx[ParseRuleName.commentdecl]);
        return {
            name: name?.image,
            base: base?.image,
        }
    }

    [ParseRuleName.nativedecl](ctx) {
        const name = ctx[JassTokenMap.identifier.name]?.[0];

        this.#mark(ctx[JassTokenMap.constant.name]?.[0], JassTokenLegend.jass_constant);
        this.#mark(name, JassTokenLegend.jass_function_native);
        this.#mark(ctx[JassTokenMap.native.name]?.[0], JassTokenLegend.jass_native);
        this.#mark(ctx[JassTokenMap.takes.name]?.[0], JassTokenLegend.jass_takes);
        this.#mark(ctx[JassTokenMap.returns.name]?.[0], JassTokenLegend.jass_returns);

        this.visit(ctx[ParseRuleName.commentdecl]);
        return {
            name: name?.image,
            arguments: this.visit(ctx[ParseRuleName.funcarglist]),
            return: this.visit(ctx[ParseRuleName.funcreturntype]),
        };
    }

    [ParseRuleName.funcdecl](ctx) {
        this.#mark(ctx[JassTokenMap.function.name]?.[0], JassTokenLegend.jass_function);
        this.#mark(ctx[JassTokenMap.identifier.name]?.[0], JassTokenLegend.jass_function_user);
        this.#mark(ctx[JassTokenMap.takes.name]?.[0], JassTokenLegend.jass_takes);
        this.#mark(ctx[JassTokenMap.returns.name]?.[0], JassTokenLegend.jass_returns);
        this.#mark(ctx[JassTokenMap.endfunction.name]?.[0], JassTokenLegend.jass_endfunction);

        this.visit(ctx[ParseRuleName.commentdecl]);

        const locals = ctx?.[ParseRuleName.localgroup];

        // argument
        /** @type {Object.<string,import('chevrotain').IToken[]>}*/
        const args = this.visit(ctx[ParseRuleName.funcarglist]);

        // check array in argument
        for (const arg of args.list) {
            const array = arg[JassTokenMap.array.name];
            if (array) this.diagnostics?.push({
                message: `Array not allowed in function argument`,
                range: ITokenToRange(array),
                severity: DiagnosticSeverity.Error,
            });
        }

        // locals, check locals with same name, check local redeclare argument
        if (locals) {
            /** @type {Object.<string,import('chevrotain').IToken[]>}*/
            const localMap = {};

            for (const local of locals) {
                const typedname = this.visit(local)?.[ParseRuleName.typedname];
                if (!typedname) continue;
                const {type, name} = typedname;
                this.#mark(type, JassTokenLegend.jass_type_name);
                this.#mark(name, JassTokenLegend.jass_variable);
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

        // statement
        const statements = ctx[ParseRuleName.statement];
        if (statements) for (const statement of statements) {
            this.visit(statement);
        }

        // return
        this.visit(ctx[ParseRuleName.funcreturntype]);

        // final
        return {};
    }

    [ParseRuleName.typedname](ctx) {
        const array = ctx[JassTokenMap.array.name]?.[0];
        this.#mark(array, JassTokenLegend.jass_array);

        const list = ctx[JassTokenMap.identifier.name];
        if (!list) return {};

        let [type, name] = list;
        if (type.isInsertedInRecovery) type = null;
        if (name.isInsertedInRecovery) name = null;
        return {
            type: type,
            name: name,
            array: array,
        };
    }

    [ParseRuleName.funcarglist](ctx) {
        let token;

        // nothing
        if (token = ctx?.[JassTokenMap.nothing.name]?.[0]) {
            this.#mark(token, JassTokenLegend.jass_type_name);
            return {map: {}, list: []};
        }

        // commas
        if (token = ctx[JassTokenMap.comma.name]) for (const comma of token) {
            this.#mark(comma, JassTokenLegend.jass_comma);
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
                this.#mark(type, JassTokenLegend.jass_type_name);
                this.#mark(name, JassTokenLegend.jass_argument);
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
            this.#mark(token, JassTokenLegend.jass_type_name);
            return token.image;
        }

        if (token = ctx[JassTokenMap.identifier.name]?.[0]) {
            this.#mark(token, JassTokenLegend.jass_type_name);
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
        this.#mark(ctx[JassTokenMap.local.name]?.[0], JassTokenLegend.jass_local);
        return this.visit(ctx[ParseRuleName.vardecl]);
    }

    [ParseRuleName.vardecl](ctx) {
        const equals = ctx[JassTokenMap.equals.name]?.[0];
        const typedname = this.visit(ctx[ParseRuleName.typedname]);
        const array = typedname[JassTokenMap.array.name];

        // check array assing
        if (equals && array) this.diagnostics?.push({
            message: `Array varriables can't be initialised`,
            range: ITokenToRange(array),
            severity: DiagnosticSeverity.Error,
        });

        this.#mark(ctx[JassTokenMap.constant.name]?.[0], JassTokenLegend.jass_constant);
        this.#mark(ctx[JassTokenMap.equals.name]?.[0], JassTokenLegend.jass_operator);
        this.visit(ctx[ParseRuleName.commentdecl]);
        this.visit(ctx[ParseRuleName.expression]);
        return {
            [ParseRuleName.typedname]: typedname,
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
        ctx[JassTokenMap.add.name]?.map(item => this.#mark(item, JassTokenLegend.jass_operator));
        ctx[JassTokenMap.sub.name]?.map(item => this.#mark(item, JassTokenLegend.jass_operator));
        this.visit(ctx[ParseRuleName.multiplication]);
        return ctx;
    }

    [ParseRuleName.multiplication](ctx) {
        ctx[JassTokenMap.mult.name]?.map(item => this.#mark(item, JassTokenLegend.jass_operator));
        ctx[JassTokenMap.div.name]?.map(item => this.#mark(item, JassTokenLegend.jass_operator));
        this.visit(ctx[ParseRuleName.primary]);
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

    //region statement
    [ParseRuleName.statement](ctx) {
        if (ctx[JassTokenMap.linebreak.name]) return null;
        let node;
        if (node = ctx[ParseRuleName.commentdecl]) return this.visit(node);
        if (node = ctx[ParseRuleName.ifstatement]) return this.visit(node);
        if (node = ctx[ParseRuleName.returnstatement]) return this.visit(node);
    }

    //endregion

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

    [ParseRuleName.returnstatement](ctx) {
        this.visit(ctx[ParseRuleName.commentdecl]);
        this.#mark(ctx[JassTokenMap.return.name]?.[0], JassTokenLegend.jass_return);
        return ctx;
    }

    [ParseRuleName.ifstatement](ctx) {
        ctx[ParseRuleName.commentdecl]?.map(item => this.visit(item));

        this.#mark(ctx[JassTokenMap.if.name]?.[0], JassTokenLegend.jass_if);
        this.#mark(ctx[JassTokenMap.then.name]?.[0], JassTokenLegend.jass_then);
        this.#mark(ctx[JassTokenMap.endif.name]?.[0], JassTokenLegend.jass_endif);
        this.visit(ctx[ParseRuleName.expression]);

        ctx[ParseRuleName.statement]?.map(item => this.visit(item));
        console.log('ifstatement', ctx);
        return ctx;
    }

    [ParseRuleName.optionalelseIf](ctx) {
        return ctx;
    }

    [ParseRuleName.optionalelse](ctx) {
        return ctx;
    }
}