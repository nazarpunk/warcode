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
    #mark(location, type) {
        if (this.builder === null) return;
        if (!location) return;
        this.builder?.push(
            location.startLine - 1,
            location.startColumn - 1,
            location.endColumn - location.startColumn + 1,
            type
        );
    }

    #comment(ctx) {
        ctx[ParseRuleName.end]?.map(item => this.visit(item));
        ctx[JassTokenMap.comment.name]?.map(item => this.#mark(item, JassTokenLegend.jass_comment));
    }

    [ParseRuleName.jass](ctx) {
        return ctx[ParseRuleName.root]?.map(item => this.visit(item));
    }

    [ParseRuleName.root](ctx) {
        this.#comment(ctx);
        let node;
        if (node = ctx[ParseRuleName.type_declare]) return this.visit(node);
        if (node = ctx[ParseRuleName.native_declare]) return this.visit(node);
        if (node = ctx[ParseRuleName.function_declare]) return this.visit(node);
        if (node = ctx[ParseRuleName.globals_declare]) return this.visit(node);
    }

    [ParseRuleName.end](ctx) {
        this.#mark(ctx[JassTokenMap.comment.name]?.[0], JassTokenLegend.jass_comment);
    }

    [ParseRuleName.globals_declare](ctx) {
        this.#comment(ctx);

        this.#mark(ctx[JassTokenMap.globals.name]?.[0], JassTokenLegend.jass_globals);
        this.#mark(ctx[JassTokenMap.endglobals.name]?.[0], JassTokenLegend.jass_endglobals);

        const vardecl = ctx[ParseRuleName.variable_declare];

        if (vardecl) for (const vd of vardecl) {
            const variable = this.visit(vd);
            const typedname = variable?.[ParseRuleName.typedname];
            const local = variable?.[JassTokenMap.local.name];

            if (local) this.diagnostics?.push({
                message: `Local variable not allowed in globals block`,
                range: ITokenToRange(local),
                severity: DiagnosticSeverity.Error,
            });

            if (typedname) {
                const {type, name} = typedname;
                this.#mark(type, JassTokenLegend.jass_type_name);
                this.#mark(name, JassTokenLegend.jass_variable);
            }
        }

        return ctx;
    }

    [ParseRuleName.type_declare](ctx) {
        ctx[ParseRuleName.end]?.map(item => this.visit(item));

        const name = ctx[JassTokenMap.identifier.name]?.[0];
        const base = ctx[JassTokenMap.identifier.name]?.[1];

        this.#mark(name, JassTokenLegend.jass_type_name);
        this.#mark(base, JassTokenLegend.jass_type_name);

        this.#mark(ctx[JassTokenMap.type.name]?.[0], JassTokenLegend.jass_type);
        this.#mark(ctx[JassTokenMap.extends.name]?.[0], JassTokenLegend.jass_extends);

        return {
            name: name?.image,
            base: base?.image,
        }
    }

    [ParseRuleName.native_declare](ctx) {
        this.#comment(ctx);

        this.#mark(ctx[JassTokenMap.constant.name]?.[0], JassTokenLegend.jass_constant);
        this.#mark(ctx[JassTokenMap.identifier.name]?.[0], JassTokenLegend.jass_function_native);
        this.#mark(ctx[JassTokenMap.native.name]?.[0], JassTokenLegend.jass_native);
        this.#mark(ctx[JassTokenMap.takes.name]?.[0], JassTokenLegend.jass_takes);
        this.#mark(ctx[JassTokenMap.returns.name]?.[0], JassTokenLegend.jass_returns);

        this.visit(ctx[ParseRuleName.function_args]);
        this.visit(ctx[ParseRuleName.function_returns]);
    }

    [ParseRuleName.function_declare](ctx) {
        this.#comment(ctx);

        this.#mark(ctx[JassTokenMap.function.name]?.[0], JassTokenLegend.jass_function);
        this.#mark(ctx[JassTokenMap.identifier.name]?.[0], JassTokenLegend.jass_function_user);
        this.#mark(ctx[JassTokenMap.takes.name]?.[0], JassTokenLegend.jass_takes);
        this.#mark(ctx[JassTokenMap.returns.name]?.[0], JassTokenLegend.jass_returns);
        this.#mark(ctx[JassTokenMap.endfunction.name]?.[0], JassTokenLegend.jass_endfunction);

        const locals = ctx?.[ParseRuleName.function_locals];

        // argument
        /** @type {Object.<string,import('chevrotain').IToken[]>}*/
        const args = this.visit(ctx[ParseRuleName.function_args]);

        // check array in argument
        if (args?.list) for (const arg of args.list) {
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
        this.visit(ctx[ParseRuleName.function_returns]);

        // final
        return {};
    }

    [ParseRuleName.function_locals](ctx) {
        this.#comment(ctx);

        const variableDeclare = ctx[ParseRuleName.variable_declare];
        if (!variableDeclare) return null;
        const variable = this.visit(variableDeclare);

        const constant = variable?.[JassTokenMap.constant.name];
        if (constant) this.diagnostics?.push({
            message: `Constant not allowed in function`,
            range: ITokenToRange(constant),
            severity: DiagnosticSeverity.Error,
        });

        const local = variable?.[JassTokenMap.local.name];
        if (!local) {
            const {type} = variable?.[ParseRuleName.typedname];
            if (type) this.diagnostics?.push({
                message: `Missing local keyword`,
                range: ITokenToRange(type),
                severity: DiagnosticSeverity.Error,
            });
        }

        return variable;
    }

    [ParseRuleName.typedname](ctx) {
        const array = ctx[JassTokenMap.array.name]?.[0];
        this.#mark(array, JassTokenLegend.jass_array);

        const list = ctx[JassTokenMap.identifier.name];
        if (!list) return {};

        let [type, name] = list;
        if (type?.isInsertedInRecovery ?? false) type = null;
        if (name?.isInsertedInRecovery ?? false) name = null;
        return {
            type: type,
            name: name,
            array: array,
        };
    }

    [ParseRuleName.function_call](ctx) {
        this.#mark(ctx[JassTokenMap.identifier.name]?.[0], JassTokenLegend.jass_function_user);

        let token;
        if (token = ctx[JassTokenMap.comma.name]) for (const comma of token) {
            this.#mark(comma, JassTokenLegend.jass_comma);
        }
        return ctx;
    }

    [ParseRuleName.function_args](ctx) {
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

    [ParseRuleName.function_returns](ctx) {
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

    [ParseRuleName.variable_declare](ctx) {
        this.#comment(ctx);

        const equals = ctx[JassTokenMap.assign.name]?.[0];
        const typedname = this.visit(ctx[ParseRuleName.typedname]);
        const array = typedname[JassTokenMap.array.name];

        // check array assing
        if (equals && array) this.diagnostics?.push({
            message: `Array varriables can't be initialised`,
            range: ITokenToRange(array),
            severity: DiagnosticSeverity.Error,
        });

        const local = ctx[JassTokenMap.local.name]?.[0];
        if (local) this.#mark(local, JassTokenLegend.jass_local);

        const constant = ctx[JassTokenMap.constant.name]?.[0];
        if (constant) this.#mark(constant, JassTokenLegend.jass_constant);

        this.#mark(ctx[JassTokenMap.assign.name]?.[0], JassTokenLegend.jass_equals);
        this.visit(ctx[ParseRuleName.expression]);
        return {
            [ParseRuleName.typedname]: typedname,
            [JassTokenMap.local.name]: local,
            [JassTokenMap.constant.name]: constant,
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
        ctx[JassTokenMap.add.name]?.map(item => this.#mark(item, JassTokenLegend.jass_add));
        ctx[JassTokenMap.sub.name]?.map(item => this.#mark(item, JassTokenLegend.jass_sub));
        this.visit(ctx[ParseRuleName.multiplication]);
        return ctx;
    }

    [ParseRuleName.multiplication](ctx) {
        ctx[JassTokenMap.mult.name]?.map(item => this.#mark(item, JassTokenLegend.jass_mult));
        ctx[JassTokenMap.div.name]?.map(item => this.#mark(item, JassTokenLegend.jass_div));
        this.visit(ctx[ParseRuleName.primary]);
        return ctx;
    }

    [ParseRuleName.primary](ctx) {
        return ctx;
    }

    [ParseRuleName.arrayaccess](ctx) {
        return ctx;
    }

    [ParseRuleName.statement](ctx) {
        this.#comment(ctx);
        let node;
        if (node = ctx[ParseRuleName.if_statement]) return this.visit(node);
        if (node = ctx[ParseRuleName.set_statement]) return this.visit(node);
        if (node = ctx[ParseRuleName.call_statement]) return this.visit(node);
        if (node = ctx[ParseRuleName.loop_statement]) return this.visit(node);
        if (node = ctx[ParseRuleName.exitwhen_statement]) return this.visit(node);
        if (node = ctx[ParseRuleName.return_statement]) return this.visit(node);
        return null;
    }

    [ParseRuleName.call_statement](ctx) {
        this.#comment(ctx);
        this.#mark(ctx[JassTokenMap.call.name]?.[0], JassTokenLegend.jass_call);
        this.visit(ctx[ParseRuleName.function_call]);
        return null;
    }

    [ParseRuleName.set_statement](ctx) {
        this.#comment(ctx);
        this.#mark(ctx[JassTokenMap.set.name]?.[0], JassTokenLegend.jass_set);
        this.#mark(ctx[JassTokenMap.identifier.name]?.[0], JassTokenLegend.jass_variable);
        this.#mark(ctx[JassTokenMap.assign.name]?.[0], JassTokenLegend.jass_assign);
        return null;
    }

    [ParseRuleName.loop_statement](ctx) {
        this.#comment(ctx);
        this.#mark(ctx[JassTokenMap.loop.name]?.[0], JassTokenLegend.jass_loop);
        this.#mark(ctx[JassTokenMap.endloop.name]?.[0], JassTokenLegend.jass_endloop);
        ctx[ParseRuleName.statement]?.map(item => this.visit(item));
        return ctx;
    }

    [ParseRuleName.exitwhen_statement](ctx) {
        this.#mark(ctx[JassTokenMap.exitwhen.name]?.[0], JassTokenLegend.jass_loop);
        return ctx;
    }

    [ParseRuleName.return_statement](ctx) {
        this.#comment(ctx);
        this.#mark(ctx[JassTokenMap.return.name]?.[0], JassTokenLegend.jass_return);
        return null;
    }

    [ParseRuleName.if_statement](ctx) {
        this.#comment(ctx);

        this.#mark(ctx[JassTokenMap.if.name]?.[0], JassTokenLegend.jass_if);
        this.#mark(ctx[JassTokenMap.then.name]?.[0], JassTokenLegend.jass_then);
        this.#mark(ctx[JassTokenMap.endif.name]?.[0], JassTokenLegend.jass_endif);

        this.visit(ctx[ParseRuleName.expression]);
        ctx[ParseRuleName.statement]?.map(item => this.visit(item));
        ctx[ParseRuleName.elseif_statement]?.map(item => this.visit(item));
        this.visit(ctx[ParseRuleName.else_statement]);
        return ctx;
    }

    [ParseRuleName.elseif_statement](ctx) {
        this.#comment(ctx);

        this.visit(ctx[ParseRuleName.expression]);
        this.#mark(ctx[JassTokenMap.elseif.name]?.[0], JassTokenLegend.jass_elseif);
        this.#mark(ctx[JassTokenMap.then.name]?.[0], JassTokenLegend.jass_then);
        ctx[ParseRuleName.statement]?.map(item => this.visit(item));
        return ctx;
    }

    [ParseRuleName.else_statement](ctx) {
        this.#comment(ctx);
        this.#mark(ctx[JassTokenMap.else.name]?.[0], JassTokenLegend.jass_else);
        ctx[ParseRuleName.statement]?.map(item => this.visit(item));
        return ctx;
    }
}