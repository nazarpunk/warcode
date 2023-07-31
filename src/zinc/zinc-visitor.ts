// noinspection DuplicatedCode

import {DiagnosticSeverity, Range} from 'vscode'
import type VscodeBridge from '../utils/vscode-bridge'
import TokenLegend from '../semantic/token-legend'
import ZincRule from './zinc-rule'
import {type IToken} from '@chevrotain/types'
import type ZincCstNode from './zinc-cst-node'
import ZincParser from './zinc-parser'
import i18next from 'i18next'
import {i18n} from '../utils/i18n'

const parser = new ZincParser()
const ParserVisitor = parser.getBaseCstVisitorConstructor()

export class ZincVisitor extends ParserVisitor {
    constructor() {
        super()
        this.validateVisitor()
    }

    bridge?: VscodeBridge

    #string(ctx: ZincCstNode) {
        const strings = ctx[ZincRule.stringliteral]
        if (!strings) return
        const b = this.bridge
        if (b) {
            for (const string of strings) {
                const start = b.document.positionAt(string.startOffset)
                const end = b.document.positionAt(string.startOffset + string.image.length)

                if (start.line === end.line) {
                    b.mark(string, TokenLegend.jass_stringliteral)
                    continue
                }
                if (string) {
                    b.diagnostics.push({
                        message: i18next.t(i18n.multilineStringError),
                        range: new Range(
                            b.document.positionAt(string.startOffset),
                            b.document.positionAt(string.startOffset + string.image.length),
                        ),
                        severity: DiagnosticSeverity.Warning
                    })
                }
            }
        }
    }

    [ZincRule.zinc](ctx: ZincCstNode) {
        //console.log(ZincRule.zinc, ctx);
        ctx[ZincRule.library_declare]?.map(item => this.visit(item))
    }

    [ZincRule.library_declare](ctx: ZincCstNode) {
        //console.log(ZincRule.library_declare, ctx);
        ctx[ZincRule.library_root]?.map(item => this.visit(item))

        const b = this?.bridge
        if (b) {
            b.mark(ctx[ZincRule.library]?.[0], TokenLegend.jass_function)
            b.mark(ctx[ZincRule.identifier]?.[0], TokenLegend.jass_function_user)
            b.mark(ctx[ZincRule.lcurlyparen]?.[0], TokenLegend.jass_lparen)
            b.mark(ctx[ZincRule.rcurlyparen]?.[0], TokenLegend.jass_rparen)
        }
    }

    [ZincRule.access_scope](ctx: ZincCstNode) {
        ctx[ZincRule.library_root]?.map(item => this.visit(item))
        const b = this?.bridge
        if (b) {
            b.mark(ctx[ZincRule.public]?.[0], TokenLegend.jass_constant)
            b.mark(ctx[ZincRule.private]?.[0], TokenLegend.jass_constant)
            b.mark(ctx[ZincRule.lcurlyparen]?.[0], TokenLegend.jass_lparen)
            b.mark(ctx[ZincRule.rcurlyparen]?.[0], TokenLegend.jass_rparen)
        }
    }

    [ZincRule.library_root](ctx: ZincCstNode) {
        ctx[ZincRule.access_scope]?.map(item => this.visit(item))

        const b = this?.bridge
        const vardecl = ctx[ZincRule.variable_declare]

        if (vardecl) {
            for (const vd of vardecl) {
                const variable = this.visit(vd)
                const typedname = variable?.[ZincRule.typedname]

                if (typedname) {
                    const {type, name} = typedname
                    if (b) {
                        b.mark(type, TokenLegend.jass_type_name)
                        b.mark(name, TokenLegend.jass_variable)
                    }
                }
            }
        }
    }

    [ZincRule.function_declare](ctx: ZincCstNode) {
        const b = this?.bridge

        if (b) {
            b.mark(ctx[ZincRule.constant]?.[0], TokenLegend.jass_constant)
            b.mark(ctx[ZincRule.function]?.[0], TokenLegend.jass_function)
            b.mark(ctx[ZincRule.identifier]?.[0], TokenLegend.jass_function_user)
            b.mark(ctx[ZincRule.takes]?.[0], TokenLegend.jass_takes)
            b.mark(ctx[ZincRule.returns]?.[0], TokenLegend.jass_returns)
            b.mark(ctx[ZincRule.endfunction]?.[0], TokenLegend.jass_endfunction)
        }

        // argument
        const args = this.visit(ctx[ZincRule.function_args]!)

        // check array in argument
        if (b && args?.list) {
            for (const arg of args.list) {
                const array = arg[ZincRule.array]
                if (array) {
                    b.diagnostics.push({
                        message: i18next.t(i18n.arrayInFunctionArgumentError),
                        range: new Range(
                            b.document.positionAt(array.startOffset),
                            b.document.positionAt(array.startOffset + array.image.length)
                        ),
                        severity: DiagnosticSeverity.Error
                    })
                }
            }
        }

        const locals = ctx?.[ZincRule.function_locals]

        // locals, check locals with same name, check local redeclare argument
        if (locals) {
            const localMap: Record<string, IToken[]> = {}

            for (const local of locals) {
                const typedname = this.visit(local)?.[ZincRule.typedname]
                if (!typedname) continue
                const {type, name} = typedname
                if (b) {
                    b.mark(type, TokenLegend.jass_type_name)
                    b.mark(name, TokenLegend.jass_variable)
                }
                if (name) {
                    (localMap[name.image] ??= []).push(name)
                    const argList = args.map[name.image]
                    if (b && argList) {
                        for (const t of [name, ...argList]) {
                            this.bridge?.diagnostics.push({
                                message: i18next.t(i18n.localRedeclareArgError, {name: t.image}),
                                range: new Range(
                                    b.document.positionAt(t.startOffset),
                                    b.document.positionAt(t.startOffset + t.image.length)
                                ),
                                severity: DiagnosticSeverity.Warning
                            })
                        }
                    }
                }
            }

            if (b) for (const v of Object.values(localMap)) {
                if (v.length < 2) continue
                for (const t of v) {
                    b.diagnostics.push({
                        message: i18next.t(i18n.localRedeclareLocalError, {name: t.image}),
                        range: new Range(
                            b.document.positionAt(t.startOffset),
                            b.document.positionAt(t.startOffset + t.image.length)
                        ),
                        severity: DiagnosticSeverity.Warning
                    })
                }
            }
        }

        // statement
        const statements = ctx[ZincRule.statement]
        if (statements) {
            for (const statement of statements) {
                this.visit(statement)
            }
        }

        // return
        this.visit(ctx[ZincRule.function_returns]!)

        // final
        return {}
    }

    [ZincRule.function_locals](ctx: ZincCstNode) {
        const variableDeclare = ctx[ZincRule.variable_declare]
        if (!variableDeclare) return null
        const variable = this.visit(variableDeclare)

        const b = this.bridge
        if (b) {
            const constant = variable?.[ZincRule.constant]
            if (constant) {
                b.diagnostics.push({
                    message: i18next.t(i18n.constantInFunctionError),
                    range: new Range(
                        b.document.positionAt(constant.startOffset),
                        b.document.positionAt(constant.startOffset + constant.image.length)
                    ),
                    severity: DiagnosticSeverity.Error
                })
            }
        }

        return variable
    }

    [ZincRule.typedname](ctx: ZincCstNode) {
        const array = ctx[ZincRule.array]?.[0]
        this?.bridge?.mark(array, TokenLegend.jass_array)

        const list = ctx[ZincRule.identifier]
        if (!list) return {}

        const [type, name] = list
        return {
            type: type?.isInsertedInRecovery ?? false ? null : type,
            name: name?.isInsertedInRecovery ?? false ? null : name,
            array
        }
    }

    [ZincRule.function_call](ctx: ZincCstNode) {
        // console.log(ZincRule.function_call, ctx);
        const b = this.bridge
        if (b) {
            b.mark(ctx[ZincRule.identifier]?.[0], TokenLegend.jass_function_user)
            b.mark(ctx[ZincRule.lparen]?.[0], TokenLegend.jass_lparen)
            b.mark(ctx[ZincRule.rparen]?.[0], TokenLegend.jass_rparen)
            ctx[ZincRule.comma]?.map(item => this?.bridge?.mark(item, TokenLegend.jass_comma))
        }
        ctx[ZincRule.expression]?.map(item => this.visit(item))
        return ctx
    }

    [ZincRule.function_args](ctx: ZincCstNode) {
        const b = this?.bridge

        // nothing
        const nothing = ctx?.[ZincRule.nothing]?.[0]
        if (nothing) {
            b?.mark(nothing, TokenLegend.jass_type_name)
            return {map: {}, list: []}
        }

        // commas
        const commas = ctx[ZincRule.comma]
        if (b && commas) for (const comma of commas) {
            this?.bridge?.mark(comma, TokenLegend.jass_comma)
        }

        // args
        const args = ctx?.[ZincRule.typedname]?.map(item => this.visit(item))
        const argMap: Record<string, IToken[]> = {}

        // typedname, check type same name
        if (args) {
            for (const arg of args) {
                const {type, name} = arg
                this?.bridge?.mark(type, TokenLegend.jass_type_name)
                this?.bridge?.mark(name, TokenLegend.jass_argument)
                if (name) (argMap[name.image] ??= []).push(name)
            }

            if (b) for (const v of Object.values(argMap)) {
                if (v.length < 2) continue
                for (const t of v) {
                    b.diagnostics.push({
                        message: i18next.t(i18n.sameNameArgumentError, {name: t.image}),
                        range: new Range(
                            b.document.positionAt(t.startOffset),
                            b.document.positionAt(t.startOffset + t.image.length)
                        ),
                        severity: DiagnosticSeverity.Warning
                    })
                }
            }
        }

        // return
        return {
            map: argMap,
            list: args
        }
    }

    [ZincRule.function_returns](ctx: ZincCstNode) {
        const b = this?.bridge
        const nothing = ctx[ZincRule.nothing]?.[0]
        const type = ctx[ZincRule.identifier]?.[0]

        if (b) {
            if (nothing) b.mark(nothing, TokenLegend.jass_type_name)
            if (type) b.mark(type, TokenLegend.jass_type_name)
        }

        return null
    }

    [ZincRule.variable_declare](ctx: ZincCstNode) {
        //console.log(ZincRule.variable_declare, ctx)

        const equals = ctx[ZincRule.assign]?.[0]
        const typedname = this.visit(ctx[ZincRule.typedname]!)
        const array = typedname[ZincRule.array]
        const b = this.bridge

        // check array assing
        if (b && equals && array) {
            b.diagnostics.push({
                message: i18next.t(i18n.arrayInitializeError),
                range: new Range(
                    b.document.positionAt(array.startOffset),
                    b.document.positionAt(array.startOffset + array.image.length)
                ),
                severity: DiagnosticSeverity.Error
            })
        }

        const constant = ctx[ZincRule.constant]?.[0]

        if (b) {
            if (constant) b.mark(constant, TokenLegend.jass_constant)
            b.mark(ctx[ZincRule.public]?.[0], TokenLegend.jass_constant)
            b.mark(ctx[ZincRule.private]?.[0], TokenLegend.jass_constant)
            b.mark(ctx[ZincRule.semicolon]?.[0], TokenLegend.jass_comma)
            b.mark(ctx[ZincRule.assign]?.[0], TokenLegend.jass_equals)
        }

        const exp = ctx[ZincRule.expression]
        if (exp) this.visit(exp)

        return {
            [ZincRule.typedname]: typedname,
            [ZincRule.constant]: constant
        }
    }

    [ZincRule.statement](ctx: ZincCstNode) {
        for (const statement of [
            ctx[ZincRule.if_statement],
            ctx[ZincRule.set_statement],
            ctx[ZincRule.call_statement],
            ctx[ZincRule.loop_statement],
            ctx[ZincRule.exitwhen_statement],
            ctx[ZincRule.return_statement]
        ]) if (statement) return this.visit(statement)

        return null
    }

    [ZincRule.call_statement](ctx: ZincCstNode) {
        //console.log(ZincRule.call_statement, ctx)
        this?.bridge?.mark(ctx[ZincRule.debug]?.[0], TokenLegend.jass_debug)
        this?.bridge?.mark(ctx[ZincRule.call]?.[0], TokenLegend.jass_call)
        this.visit(ctx[ZincRule.function_call]!)
        return null
    }

    [ZincRule.set_statement](ctx: ZincCstNode) {
        // console.log(ZincRule.set_statement, ctx);

        this?.bridge?.mark(ctx[ZincRule.set]?.[0], TokenLegend.jass_set)
        this?.bridge?.mark(ctx[ZincRule.identifier]?.[0], TokenLegend.jass_variable)
        this?.bridge?.mark(ctx[ZincRule.assign]?.[0], TokenLegend.jass_assign)

        this.visit(ctx[ZincRule.expression]!)
        this.visit(ctx[ZincRule.arrayaccess]!)
        return null
    }

    [ZincRule.loop_statement](ctx: ZincCstNode) {
        this?.bridge?.mark(ctx[ZincRule.loop]?.[0], TokenLegend.jass_loop)
        this?.bridge?.mark(ctx[ZincRule.endloop]?.[0], TokenLegend.jass_endloop)
        ctx[ZincRule.statement]?.map(item => this.visit(item))
        return ctx
    }

    [ZincRule.exitwhen_statement](ctx: ZincCstNode) {
        this?.bridge?.mark(ctx[ZincRule.exitwhen]?.[0], TokenLegend.jass_loop)

        this.visit(ctx[ZincRule.expression]!)
        return ctx
    }

    [ZincRule.return_statement](ctx: ZincCstNode) {
        this?.bridge?.mark(ctx[ZincRule.return]?.[0], TokenLegend.jass_return)

        this.visit(ctx[ZincRule.expression]!)
        return null
    }

    [ZincRule.if_statement](ctx: ZincCstNode) {
        // console.log(ZincRule.if_statement, ctx);

        this?.bridge?.mark(ctx[ZincRule.if]?.[0], TokenLegend.jass_if)
        this?.bridge?.mark(ctx[ZincRule.then]?.[0], TokenLegend.jass_then)
        this?.bridge?.mark(ctx[ZincRule.endif]?.[0], TokenLegend.jass_endif)

        this.visit(ctx[ZincRule.expression]!)
        ctx[ZincRule.statement]?.map(item => this.visit(item))
        ctx[ZincRule.elseif_statement]?.map(item => this.visit(item))
        this.visit(ctx[ZincRule.else_statement]!)
        return null
    }

    [ZincRule.elseif_statement](ctx: ZincCstNode) {

        this.visit(ctx[ZincRule.expression]!)
        this?.bridge?.mark(ctx[ZincRule.elseif]?.[0], TokenLegend.jass_elseif)
        this?.bridge?.mark(ctx[ZincRule.then]?.[0], TokenLegend.jass_then)
        ctx[ZincRule.statement]?.map(item => this.visit(item))
        return null
    }

    [ZincRule.else_statement](ctx: ZincCstNode) {
        this?.bridge?.mark(ctx[ZincRule.else]?.[0], TokenLegend.jass_else)
        ctx[ZincRule.statement]?.map(item => this.visit(item))
        return null
    }

    [ZincRule.expression](ctx: ZincCstNode) {
        //console.log(ZincRule.expression, ctx);
        ctx[ZincRule.and]?.map(item => this?.bridge?.mark(item, TokenLegend.jass_and))
        ctx[ZincRule.or]?.map(item => this?.bridge?.mark(item, TokenLegend.jass_or))
        ctx[ZincRule.equals]?.map(item => this?.bridge?.mark(item, TokenLegend.jass_equals))
        ctx[ZincRule.notequals]?.map(item => this?.bridge?.mark(item, TokenLegend.jass_notequals))
        ctx[ZincRule.lessorequal]?.map(item => this?.bridge?.mark(item, TokenLegend.jass_lessorequal))
        ctx[ZincRule.great]?.map(item => this?.bridge?.mark(item, TokenLegend.jass_great))
        ctx[ZincRule.greatorequal]?.map(item => this?.bridge?.mark(item, TokenLegend.jass_greatorequal))

        ctx[ZincRule.addition]?.map(item => this.visit(item))
        return null
    }

    [ZincRule.primary](ctx: ZincCstNode) {
        //console.log(ZincRule.primary, ctx);
        this.#string(ctx)
        const b = this?.bridge
        if (b) {
            b.mark(ctx[ZincRule.sub]?.[0], TokenLegend.jass_sub)
            b.mark(ctx[ZincRule.integer]?.[0], TokenLegend.jass_integer)
            b.mark(ctx[ZincRule.real]?.[0], TokenLegend.jass_real)
            b.mark(ctx[ZincRule.idliteral]?.[0], TokenLegend.jass_idliteral)
            b.mark(ctx[ZincRule.function]?.[0], TokenLegend.jass_function)
            // TODO add colors
            b.mark(ctx[ZincRule.not]?.[0], TokenLegend.jass_function)

            const identifier = ctx[ZincRule.identifier]?.[0]
            if (identifier) {
                if (['null', 'true', 'false'].indexOf(identifier.image) < 0) {
                    b.mark(identifier, TokenLegend.jass_variable)
                } else {
                    // TODO add colors
                    b.mark(identifier, TokenLegend.jass_function)
                }
            }
        }
        this.visit(ctx[ZincRule.arrayaccess]!)
        this.visit(ctx[ZincRule.function_call]!)
        this.visit(ctx[ZincRule.expression]!)
        this.visit(ctx[ZincRule.primary]!)
        return null
    }

    [ZincRule.addition](ctx: ZincCstNode) {
        // console.log(ZincRule.addition, ctx);
        ctx[ZincRule.add]?.map(item => this?.bridge?.mark(item, TokenLegend.jass_add))
        ctx[ZincRule.sub]?.map(item => this?.bridge?.mark(item, TokenLegend.jass_sub))

        ctx[ZincRule.multiplication]?.map(item => this.visit(item))
        return null
    }

    [ZincRule.multiplication](ctx: ZincCstNode) {
        // console.log(ZincRule.multiplication, ctx);
        const b = this?.bridge

        if (b) {
            ctx[ZincRule.mult]?.map(item => b.mark(item, TokenLegend.jass_mult))
            ctx[ZincRule.div]?.map(item => b.mark(item, TokenLegend.jass_div))
        }

        ctx[ZincRule.primary]?.map(item => this.visit(item))
        return null
    }

    [ZincRule.arrayaccess](ctx: ZincCstNode) {
        // console.log(ZincRule.arrayaccess, ctx);
        this?.bridge?.mark(ctx[ZincRule.lsquareparen]?.[0], TokenLegend.jass_lsquareparen)
        this?.bridge?.mark(ctx[ZincRule.rsquareparen]?.[0], TokenLegend.jass_rsquareparen)

        this.visit(ctx[ZincRule.expression]!)
        return null
    }
}
