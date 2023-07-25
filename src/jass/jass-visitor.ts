import {DiagnosticSeverity} from "vscode";
import {JassParser} from "./jass-parser";
import VisitorVscodeBridge from "../utils/visitor-vscode-bridge";
import JassTokenMap from "./lexer/jass-token-map";
import TokenLegend from "../semantic/token-legend";
import ITokenToRange from "../utils/i-token-to-range";
import ParseRuleName from "./jass-parser-rule-name";

const parser = new JassParser();
const ParserVisitor = parser.getBaseCstVisitorConstructor();



export class JassVisitor extends ParserVisitor {
    constructor() {
        super()
        this.validateVisitor()
    }

    bridge : VisitorVscodeBridge;

    #comment(ctx) {
        ctx[ParseRuleName.end]?.map(item => this.visit(item));
        ctx[JassTokenMap.comment.name]?.map(item => this?.bridge?.mark(item, TokenLegend.jass_comment));
    }

    /** @param {import('chevrotain').CstNode} ctx */
    #string(ctx) {
        /** @type {import('chevrotain').IToken[]} */
        const strings = ctx[JassTokenMap.stringliteral.name];
        if (!strings) return;
        for (const string of strings) {
            if (string.startLine === string.endLine) {
                this?.bridge?.mark(string, TokenLegend.jass_stringliteral);
                continue;
            }
            if (string) this.bridge?.diagnostics.push({
                message: 'Avoid multiline strings. Use |n or \\n to linebreak.',
                range: ITokenToRange(string),
                severity: DiagnosticSeverity.Warning,
            });
        }
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
        this?.bridge?.mark(ctx[JassTokenMap.comment.name]?.[0], TokenLegend.jass_comment);
    }

    [ParseRuleName.globals_declare](ctx) {
        this.#comment(ctx);

        this?.bridge?.mark(ctx[JassTokenMap.globals.name]?.[0], TokenLegend.jass_globals);
        this?.bridge?.mark(ctx[JassTokenMap.endglobals.name]?.[0], TokenLegend.jass_endglobals);

        const vardecl = ctx[ParseRuleName.variable_declare];

        if (vardecl) for (const vd of vardecl) {
            const variable = this.visit(vd);
            const typedname = variable?.[ParseRuleName.typedname];
            const local = variable?.[JassTokenMap.local.name];

            if (local) this.bridge?.diagnostics.push({
                message: `Local variable not allowed in globals block.`,
                range: ITokenToRange(local),
                severity: DiagnosticSeverity.Error,
            });

            if (typedname) {
                const {type, name} = typedname;
                this?.bridge?.mark(type, TokenLegend.jass_type_name);
                this?.bridge?.mark(name, TokenLegend.jass_variable);
            }
        }

        return ctx;
    }

    [ParseRuleName.type_declare](ctx) {
        ctx[ParseRuleName.end]?.map(item => this.visit(item));

        const name = ctx[JassTokenMap.identifier.name]?.[0];
        const base = ctx[JassTokenMap.identifier.name]?.[1];

        this?.bridge?.mark(name, TokenLegend.jass_type_name);
        this?.bridge?.mark(base, TokenLegend.jass_type_name);

        this?.bridge?.mark(ctx[JassTokenMap.type.name]?.[0], TokenLegend.jass_type);
        this?.bridge?.mark(ctx[JassTokenMap.extends.name]?.[0], TokenLegend.jass_extends);

        return {
            name: name?.image,
            base: base?.image,
        }
    }

    [ParseRuleName.native_declare](ctx) {
        this.#comment(ctx);

        this?.bridge?.mark(ctx[JassTokenMap.constant.name]?.[0], TokenLegend.jass_constant);
        this?.bridge?.mark(ctx[JassTokenMap.identifier.name]?.[0], TokenLegend.jass_function_native);
        this?.bridge?.mark(ctx[JassTokenMap.native.name]?.[0], TokenLegend.jass_native);
        this?.bridge?.mark(ctx[JassTokenMap.takes.name]?.[0], TokenLegend.jass_takes);
        this?.bridge?.mark(ctx[JassTokenMap.returns.name]?.[0], TokenLegend.jass_returns);

        this.visit(ctx[ParseRuleName.function_args]);
        this.visit(ctx[ParseRuleName.function_returns]);
    }

    [ParseRuleName.function_declare](ctx) {
        this.#comment(ctx);

        this?.bridge?.mark(ctx[JassTokenMap.function.name]?.[0], TokenLegend.jass_function);
        this?.bridge?.mark(ctx[JassTokenMap.identifier.name]?.[0], TokenLegend.jass_function_user);
        this?.bridge?.mark(ctx[JassTokenMap.takes.name]?.[0], TokenLegend.jass_takes);
        this?.bridge?.mark(ctx[JassTokenMap.returns.name]?.[0], TokenLegend.jass_returns);
        this?.bridge?.mark(ctx[JassTokenMap.endfunction.name]?.[0], TokenLegend.jass_endfunction);

        const locals = ctx?.[ParseRuleName.function_locals];

        // argument
        /** @type {Object.<string,import('chevrotain').IToken[]>}*/
        const args = this.visit(ctx[ParseRuleName.function_args]);

        // check array in argument
        if (args?.list) for (const arg of args.list) {
            const array = arg[JassTokenMap.array.name];
            if (array) this.bridge?.diagnostics.push({
                message: `Array not allowed in function argument.`,
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
                this?.bridge?.mark(type, TokenLegend.jass_type_name);
                this?.bridge?.mark(name, TokenLegend.jass_variable);
                if (name) {
                    (localMap[name.image] ??= []).push(name);
                    const argList = args.map[name.image];
                    if (argList) for (const t of [name, ...argList]) {
                        this.bridge?.diagnostics.push({
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
                    this.bridge?.diagnostics.push({
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
        if (constant) this.bridge?.diagnostics.push({
            message: `Constant not allowed in function.`,
            range: ITokenToRange(constant),
            severity: DiagnosticSeverity.Error,
        });

        const local = variable?.[JassTokenMap.local.name];
        if (!local) {
            const {type} = variable?.[ParseRuleName.typedname];
            if (type) this.bridge?.diagnostics.push({
                message: `Missing local keyword.`,
                range: ITokenToRange(type),
                severity: DiagnosticSeverity.Error,
            });
        }

        return variable;
    }

    [ParseRuleName.typedname](ctx) {
        const array = ctx[JassTokenMap.array.name]?.[0];
        this?.bridge?.mark(array, TokenLegend.jass_array);

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
        //console.log('function_call', ctx);
        this?.bridge?.mark(ctx[JassTokenMap.identifier.name]?.[0], TokenLegend.jass_function_user);
        this?.bridge?.mark(ctx[JassTokenMap.lparen.name]?.[0], TokenLegend.jass_lparen);
        this?.bridge?.mark(ctx[JassTokenMap.rparen.name]?.[0], TokenLegend.jass_rparen);
        ctx[JassTokenMap.comma.name]?.map(item => this?.bridge?.mark(item, TokenLegend.jass_comma));
        ctx[ParseRuleName.expression]?.map(item => this.visit(item));
        return ctx;
    }

    [ParseRuleName.function_args](ctx) {
        let token;

        // nothing
        if (token = ctx?.[JassTokenMap.nothing.name]?.[0]) {
            this?.bridge?.mark(token, TokenLegend.jass_type_name);
            return {map: {}, list: []};
        }

        // commas
        if (token = ctx[JassTokenMap.comma.name]) for (const comma of token) {
            this?.bridge?.mark(comma, TokenLegend.jass_comma);
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
                this?.bridge?.mark(type, TokenLegend.jass_type_name);
                this?.bridge?.mark(name, TokenLegend.jass_argument);
                if (name) (argMap[name.image] ??= []).push(name);
            }

            for (const v of Object.values(argMap)) {
                if (v.length < 2) continue;
                for (const t of v) {
                    this.bridge?.diagnostics.push({
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
            this?.bridge?.mark(token, TokenLegend.jass_type_name);
            return token.image;
        }

        if (token = ctx[JassTokenMap.identifier.name]?.[0]) {
            this?.bridge?.mark(token, TokenLegend.jass_type_name);
            return token.image;
        }

        return null;
    }

    [ParseRuleName.variable_declare](ctx) {
        //console.log(ParseRuleName.variable_declare, ctx);
        this.#comment(ctx);

        const equals = ctx[JassTokenMap.assign.name]?.[0];
        const typedname = this.visit(ctx[ParseRuleName.typedname]);
        const array = typedname[JassTokenMap.array.name];

        // check array assing
        if (equals && array) this.bridge?.diagnostics.push({
            message: `Array varriables can't be initialised.`,
            range: ITokenToRange(array),
            severity: DiagnosticSeverity.Error,
        });

        const local = ctx[JassTokenMap.local.name]?.[0];
        if (local) this?.bridge?.mark(local, TokenLegend.jass_local);

        const constant = ctx[JassTokenMap.constant.name]?.[0];
        if (constant) this?.bridge?.mark(constant, TokenLegend.jass_constant);

        this?.bridge?.mark(ctx[JassTokenMap.assign.name]?.[0], TokenLegend.jass_equals);
        this.visit(ctx[ParseRuleName.expression]?.[0]);
        return {
            [ParseRuleName.typedname]: typedname,
            [JassTokenMap.local.name]: local,
            [JassTokenMap.constant.name]: constant,
        };
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
        this?.bridge?.mark(ctx[JassTokenMap.debug.name]?.[0], TokenLegend.jass_debug);
        this?.bridge?.mark(ctx[JassTokenMap.call.name]?.[0], TokenLegend.jass_call);
        this.visit(ctx[ParseRuleName.function_call]);
        return null;
    }

    [ParseRuleName.set_statement](ctx) {
        //console.log(ParseRuleName.set_statement, ctx);

        this.#comment(ctx);
        this?.bridge?.mark(ctx[JassTokenMap.set.name]?.[0], TokenLegend.jass_set);
        this?.bridge?.mark(ctx[JassTokenMap.identifier.name]?.[0], TokenLegend.jass_variable);
        this?.bridge?.mark(ctx[JassTokenMap.assign.name]?.[0], TokenLegend.jass_assign);

        this.visit(ctx[ParseRuleName.expression]);
        this.visit(ctx[ParseRuleName.arrayaccess]);
        return null;
    }

    [ParseRuleName.loop_statement](ctx) {
        this.#comment(ctx);
        this?.bridge?.mark(ctx[JassTokenMap.loop.name]?.[0], TokenLegend.jass_loop);
        this?.bridge?.mark(ctx[JassTokenMap.endloop.name]?.[0], TokenLegend.jass_endloop);
        ctx[ParseRuleName.statement]?.map(item => this.visit(item));
        return ctx;
    }

    [ParseRuleName.exitwhen_statement](ctx) {
        this.#comment(ctx);
        this?.bridge?.mark(ctx[JassTokenMap.exitwhen.name]?.[0], TokenLegend.jass_loop);

        this.visit(ctx[ParseRuleName.expression]);
        return ctx;
    }

    [ParseRuleName.return_statement](ctx) {
        this.#comment(ctx);
        this?.bridge?.mark(ctx[JassTokenMap.return.name]?.[0], TokenLegend.jass_return);

        this.visit(ctx[ParseRuleName.expression]);
        return null;
    }

    [ParseRuleName.if_statement](ctx) {
        //console.log('if_statement', ctx);
        this.#comment(ctx);

        this?.bridge?.mark(ctx[JassTokenMap.if.name]?.[0], TokenLegend.jass_if);
        this?.bridge?.mark(ctx[JassTokenMap.then.name]?.[0], TokenLegend.jass_then);
        this?.bridge?.mark(ctx[JassTokenMap.endif.name]?.[0], TokenLegend.jass_endif);

        this.visit(ctx[ParseRuleName.expression]);
        ctx[ParseRuleName.statement]?.map(item => this.visit(item));
        ctx[ParseRuleName.elseif_statement]?.map(item => this.visit(item));
        this.visit(ctx[ParseRuleName.else_statement]);
        return null;
    }

    [ParseRuleName.elseif_statement](ctx) {
        this.#comment(ctx);

        this.visit(ctx[ParseRuleName.expression]);
        this?.bridge?.mark(ctx[JassTokenMap.elseif.name]?.[0], TokenLegend.jass_elseif);
        this?.bridge?.mark(ctx[JassTokenMap.then.name]?.[0], TokenLegend.jass_then);
        ctx[ParseRuleName.statement]?.map(item => this.visit(item));
        return null;
    }

    [ParseRuleName.else_statement](ctx) {
        this.#comment(ctx);
        this?.bridge?.mark(ctx[JassTokenMap.else.name]?.[0], TokenLegend.jass_else);
        ctx[ParseRuleName.statement]?.map(item => this.visit(item));
        return null;
    }

    [ParseRuleName.expression](ctx) {
        //console.log(ParseRuleName.expression, ctx);
        ctx[JassTokenMap.and.name]?.map(item => this?.bridge?.mark(item, TokenLegend.jass_and));
        ctx[JassTokenMap.or.name]?.map(item => this?.bridge?.mark(item, TokenLegend.jass_or));
        ctx[JassTokenMap.equals.name]?.map(item => this?.bridge?.mark(item, TokenLegend.jass_equals));
        ctx[JassTokenMap.notequals.name]?.map(item => this?.bridge?.mark(item, TokenLegend.jass_notequals));
        ctx[JassTokenMap.lessorequal.name]?.map(item => this?.bridge?.mark(item, TokenLegend.jass_lessorequal));
        ctx[JassTokenMap.great.name]?.map(item => this?.bridge?.mark(item, TokenLegend.jass_great));
        ctx[JassTokenMap.greatorequal.name]?.map(item => this?.bridge?.mark(item, TokenLegend.jass_greatorequal));

        ctx[ParseRuleName.addition]?.map(item => this.visit(item));
        return null;
    }

    [ParseRuleName.primary](ctx) {
        //console.log(ParseRuleName.primary, ctx);
        this.#string(ctx);
        this?.bridge?.mark(ctx[JassTokenMap.sub.name]?.[0], TokenLegend.jass_sub);
        this?.bridge?.mark(ctx[JassTokenMap.integer.name]?.[0], TokenLegend.jass_integer);
        this?.bridge?.mark(ctx[JassTokenMap.real.name]?.[0], TokenLegend.jass_real);
        this?.bridge?.mark(ctx[JassTokenMap.idliteral.name]?.[0], TokenLegend.jass_idliteral);
        this?.bridge?.mark(ctx[JassTokenMap.identifier.name]?.[0], TokenLegend.jass_variable);
        this.visit(ctx[ParseRuleName.arrayaccess]);
        this.visit(ctx[ParseRuleName.function_call]);
        this.visit(ctx[ParseRuleName.expression]);
        return null;
    }

    [ParseRuleName.addition](ctx) {
        //console.log('addition', ctx);
        ctx[JassTokenMap.add.name]?.map(item => this?.bridge?.mark(item, TokenLegend.jass_add));
        ctx[JassTokenMap.sub.name]?.map(item => this?.bridge?.mark(item, TokenLegend.jass_sub));

        ctx[ParseRuleName.multiplication]?.map(item => this.visit(item));
        return null;
    }

    [ParseRuleName.multiplication](ctx) {
        //console.log('multiplication', ctx);
        ctx[JassTokenMap.mult.name]?.map(item => this?.bridge?.mark(item, TokenLegend.jass_mult));
        ctx[JassTokenMap.div.name]?.map(item => this?.bridge?.mark(item, TokenLegend.jass_div));

        ctx[ParseRuleName.primary]?.map(item => this.visit(item));
        return null;
    }

    [ParseRuleName.arrayaccess](ctx) {
        //console.log(ParseRuleName.arrayaccess, ctx);
        this?.bridge?.mark(ctx[JassTokenMap.lsquareparen.name]?.[0], TokenLegend.jass_lsquareparen);
        this?.bridge?.mark(ctx[JassTokenMap.rsquareparen.name]?.[0], TokenLegend.jass_rsquareparen);

        this.visit(ctx[ParseRuleName.expression]?.[0]);
        return null;
    }
}