// noinspection DuplicatedCode

import {
    Diagnostic,
    DiagnosticSeverity,
    DocumentSymbol,
    FoldingRange,
    FoldingRangeKind,
    Range,
    SemanticTokensBuilder,
    SymbolKind,
    TextDocument
} from 'vscode'
import TokenLegend from '../semantic/token-legend'
import JassRule from './jass-rule'
import {type IToken} from '@chevrotain/types'
import type JassCstNode from './jass-cst-node'
import JassParser from './jass-parser'
import i18next from 'i18next'
import {i18n} from '../utils/i18n'
import {IVisitor} from '../utils/ext-provider'
import {CstNode} from 'chevrotain'

const parser = new JassParser()
const ParserVisitor = parser.getBaseCstVisitorConstructor()

interface TypedName {
    type: IToken,
    name: IToken,
    array?: IToken
}

interface Variable {
    typedname: TypedName
}

interface FuncHead {
    name: IToken | null,
    argMap: Record<string, IToken[]>,
    returns: IToken | null
}

export class JassVisitor extends ParserVisitor implements IVisitor {
    constructor() {
        super()
        this.validateVisitor()
    }

    declare document: TextDocument
    declare builder: SemanticTokensBuilder
    declare diagnostics: Diagnostic[]
    declare symbols: DocumentSymbol[]
    declare foldings: FoldingRange[]

    #mark(token: IToken | undefined, type: number) {
        if (!token || isNaN(token.startOffset)) return
        const p = this.document.positionAt(token.startOffset)
        this.builder.push(p.line, p.character, token.image.length, type)
    }

    #token(ctx: JassCstNode, rule: JassRule, type: TokenLegend): IToken | null {
        const token = ctx[rule]?.[0] as IToken
        if (!token || isNaN(token.startOffset) || token.isInsertedInRecovery) return null
        const p = this.document.positionAt(token.startOffset)
        this.builder.push(p.line, p.character, token.image.length, type)
        return token
    }

    #tokens(ctx: JassCstNode, rule: JassRule, type: TokenLegend) {
        const tokens = ctx[rule] as IToken[]
        if (!tokens) return
        for (const token of tokens) {
            const p = this.document.positionAt(token.startOffset)
            this.builder.push(p.line, p.character, token.image.length, type)
        }
    }

    #node(ctx: JassCstNode, rule: JassRule, param?: any) {
        const node = ctx[rule]?.[0] as CstNode
        if (!node) return
        return this.visit(node, param)
    }

    #nodes(ctx: JassCstNode, rule: JassRule) {
        const nodes = ctx[rule] as CstNode[]
        if (!nodes) return
        for (const node of nodes) this.visit(node)
    }

    #string(ctx: JassCstNode) {
        const strings = ctx[JassRule.stringliteral]
        if (!strings) return

        for (const string of strings) {
            const start = this.document.positionAt(string.startOffset)
            const end = this.document.positionAt(string.startOffset + string.image.length)
            if (start.line === end.line) {
                this.#mark(string, TokenLegend.jass_stringliteral)
                continue
            }
            if (string) {
                this.diagnostics.push({
                    message: i18next.t(i18n.multilineStringError),
                    range: new Range(
                        this.document.positionAt(string.startOffset),
                        this.document.positionAt(string.startOffset + string.image.length),
                    ),
                    severity: DiagnosticSeverity.Warning
                })
            }
        }
    }

    #documentSymbol(name: string, detail: string, kind: SymbolKind, start: IToken, end?: IToken, selection?: IToken): DocumentSymbol {
        let range: Range
        const startPos = this.document.positionAt(start.startOffset)
        selection ??= start
        if (end) {
            const endPos = this.document.positionAt(end!.startOffset + end!.image.length)
            range = new Range(startPos, endPos)
            if (startPos.line !== endPos.line) this.foldings.push(new FoldingRange(startPos.line, endPos.line, FoldingRangeKind.Region))
        } else {
            range = this.document.lineAt(startPos.line).range
        }
        return new DocumentSymbol(name, detail, kind, range, new Range(
            this.document.positionAt(selection.startOffset),
            this.document.positionAt(selection.startOffset + selection.image.length),
        ))
    }

    [JassRule.jass](ctx: JassCstNode) {
        delete ctx[JassRule.linebreak]
        //console.log(JassRule.jass, ctx)
        this.#nodes(ctx, JassRule.jass_constant)
        this.#nodes(ctx, JassRule.type_declare)
        this.#nodes(ctx, JassRule.globals_declare)
    }

    [JassRule.jass_constant](ctx: JassCstNode) {
        //console.log(JassRule.jass_constant, ctx)
        const constant = this.#token(ctx, JassRule.constant, TokenLegend.jass_constant)
        this.#node(ctx, JassRule.function_declare, {constant: constant})
        this.#node(ctx, JassRule.native_declare, {constant: constant})
    }

    [JassRule.native_declare](ctx: JassCstNode) {
        //console.log(JassRule.native_declare, ctx)
        this.#token(ctx, JassRule.native, TokenLegend.jass_native)
        const head = this.visit(ctx[JassRule.function_head]!, {native: true}) as FuncHead
        const {name, returns} = head
        if (name && returns) this.symbols.push(this.#documentSymbol(name.image, returns.image, SymbolKind.Function, name))
    }

    [JassRule.function_declare](ctx: JassCstNode) {
        //console.log(JassRule.function_declare, ctx)

        // Cannot return value from function that returns nothing

        // --- head
        const head = this.visit(ctx[JassRule.function_head]!) as FuncHead
        const {name, argMap, returns} = head

        const func = this.#token(ctx, JassRule.function, TokenLegend.jass_function)
        const endfunc = this.#token(ctx, JassRule.endfunction, TokenLegend.jass_endfunction)

        if (func && endfunc && name && returns) {
            this.symbols.push(this.#documentSymbol(name.image, returns.image, SymbolKind.Function, func, endfunc, name))
        }

        const localMap: Record<string, IToken[]> = {}

        // --- locals
        // keyword
        const locals = ctx[JassRule.local]
        if (locals) for (const local of locals) this.#mark(local, TokenLegend.jass_local)

        // declare
        const variableDeclare = ctx[JassRule.variable_declare]!
        if (variableDeclare) {
            for (const localDeclare of variableDeclare) {
                const local = this.visit(localDeclare) as Variable | null
                if (!local) continue
                const {type, name} = local.typedname
                this.#mark(type, TokenLegend.jass_type_name)
                this.#mark(name, TokenLegend.jass_variable_local)
                // local check: local redeclare arg
                if (name) {
                    (localMap[name.image] ??= []).push(name)
                    const argList = argMap[name.image]
                    if (argList) {
                        for (const t of [name, ...argList]) {
                            this.diagnostics.push({
                                message: i18next.t(i18n.localRedeclareArgError, {name: t.image}),
                                range: new Range(
                                    this.document.positionAt(t.startOffset),
                                    this.document.positionAt(t.startOffset + t.image.length)
                                ),
                                severity: DiagnosticSeverity.Warning
                            })
                        }
                    }
                }
            }

            // local check: local redeclare arg
            for (const locals of Object.values(localMap)) {
                if (locals.length < 2) continue
                for (const local of locals) {
                    this.diagnostics.push({
                        message: i18next.t(i18n.localRedeclareLocalError, {name: local.image}),
                        range: new Range(
                            this.document.positionAt(local.startOffset),
                            this.document.positionAt(local.startOffset + local.image.length)
                        ),
                        severity: DiagnosticSeverity.Warning
                    })
                }
            }
        }

        // --- statement
        const statements = ctx[JassRule.statement]
        if (statements) {
            for (const statement of statements) {
                this.visit(statement)
            }
        }
    }

    [JassRule.function_head](ctx: JassCstNode, opts: { native?: boolean }): FuncHead {
        //console.log(JassRule.function_head, ctx)
        // --- keywords
        this.#token(ctx, JassRule.takes, TokenLegend.jass_takes)
        this.#token(ctx, JassRule.returns, TokenLegend.jass_returns)

        // --- name
        const name = this.#token(ctx, JassRule.identifier_name, opts?.native ? TokenLegend.jass_function_native : TokenLegend.jass_function_user)

        // --- arguments
        const argMap: Record<string, IToken[]> = {}
        const takesNothing = ctx[JassRule.takes_nothing]?.[0]
        if (takesNothing) {
            this.#mark(takesNothing, TokenLegend.jass_type_name)
        } else {
            // commas
            const commas = ctx[JassRule.comma]
            if (commas) for (const comma of commas) this.#mark(comma, TokenLegend.jass_comma)
            // typename
            const typednames = ctx?.[JassRule.typedname]
            if (typednames) for (const typedname of typednames) {
                const typename = this.visit(typedname) as TypedName
                if (typename) {
                    const {type, name, array} = typename
                    if (name) (argMap[name.image] ??= []).push(name)
                    this.#mark(type, TokenLegend.jass_type_name)
                    this.#mark(name, TokenLegend.jass_argument)
                    if (array) {
                        this.diagnostics.push({
                            message: i18next.t(i18n.arrayInFunctionArgumentError),
                            range: new Range(
                                this.document.positionAt(array.startOffset),
                                this.document.positionAt(array.startOffset + array.image.length)
                            ),
                            severity: DiagnosticSeverity.Error
                        })
                    }
                }
            }

            // arguments check: same name
            for (const v of Object.values(argMap)) {
                if (v.length < 2) continue
                for (const t of v) {
                    this.diagnostics.push({
                        message: i18next.t(i18n.sameNameArgumentError, {name: t.image}),
                        range: new Range(
                            this.document.positionAt(t.startOffset),
                            this.document.positionAt(t.startOffset + t.image.length)
                        ),
                        severity: DiagnosticSeverity.Warning
                    })
                }
            }
        }

        // -- returns
        let returns = this.#token(ctx, JassRule.returns_nothing, TokenLegend.jass_type_name)
        if (!returns) returns = this.#token(ctx, JassRule.identifier_returns, TokenLegend.jass_type_name)

        // --- final
        return {
            name: name,
            argMap: argMap,
            returns: returns
        }
    }

    [JassRule.variable_declare](ctx: JassCstNode): Variable | null {
        //console.log(JassRule.variable_declare, ctx);
        const equals = ctx[JassRule.assign]?.[0]
        const typedname = this.visit(ctx[JassRule.typedname]!)
        if (!typedname) return null

        const array = typedname[JassRule.array]

        // check array assing
        if (equals && array) {
            this.diagnostics.push({
                message: i18next.t(i18n.arrayInitializeError),
                range: new Range(
                    this.document.positionAt(array.startOffset),
                    this.document.positionAt(array.startOffset + array.image.length)
                ),
                severity: DiagnosticSeverity.Error
            })
        }

        this.#token(ctx, JassRule.assign, TokenLegend.jass_assign)
        this.#node(ctx, JassRule.expression)

        return {
            typedname: typedname,
        }
    }

    [JassRule.globals_declare](ctx: JassCstNode) {
        this.#tokens(ctx, JassRule.constant, TokenLegend.jass_takes)

        const globals = this.#token(ctx, JassRule.globals, TokenLegend.jass_globals)
        const endglobals = this.#token(ctx, JassRule.endglobals, TokenLegend.jass_endglobals)

        let globalsSymbol: DocumentSymbol | undefined

        if (globals && endglobals) {
            globalsSymbol = this.#documentSymbol(globals.image, '', SymbolKind.Namespace, globals, endglobals)
            this.symbols.push(globalsSymbol)
        }

        const vardecl = ctx[JassRule.variable_declare]

        if (vardecl) {
            for (const vd of vardecl) {
                const variable = this.visit(vd)
                const typedname = variable?.[JassRule.typedname]
                const local: IToken = variable?.[JassRule.local]

                if (local) {
                    this.diagnostics.push({
                        message: i18next.t(i18n.localInGlobalsError),
                        range: new Range(
                            this.document.positionAt(local.startOffset),
                            this.document.positionAt(local.startOffset + local.image.length)
                        ),
                        severity: DiagnosticSeverity.Error
                    })
                }

                if (typedname) {
                    const {type, name} = typedname
                    this.#mark(type, TokenLegend.jass_type_name)
                    this.#mark(name, TokenLegend.jass_variable_global)
                    if (globalsSymbol && type && name) {
                        globalsSymbol.children.push(this.#documentSymbol(name.image, type.image, SymbolKind.Variable, type, undefined, name))
                    }
                }
            }
        }
    }

    [JassRule.type_declare](ctx: JassCstNode) {
        const name = this.#token(ctx, JassRule.identifier_name, TokenLegend.jass_type_name)
        const base = this.#token(ctx, JassRule.identifier_base, TokenLegend.jass_type_name)
        if (name && base) this.symbols.push(this.#documentSymbol(name.image, base.image, SymbolKind.TypeParameter, name))

        this.#token(ctx, JassRule.type, TokenLegend.jass_type)
        this.#token(ctx, JassRule.extends, TokenLegend.jass_extends)
    }

    [JassRule.typedname](ctx: JassCstNode): TypedName | null {
        const array = ctx[JassRule.array]?.[0]
        this.#mark(array, TokenLegend.jass_array)

        const list = ctx[JassRule.identifier]
        if (!list || list.length != 2) return null

        const [type, name] = list
        if (type.isInsertedInRecovery || name.isInsertedInRecovery) return null

        return {
            type: type,
            name: name,
            array: array
        }
    }

    [JassRule.function_call](ctx: JassCstNode) {
        // console.log(JassRule.function_call, ctx);
        this.#token(ctx, JassRule.identifier, TokenLegend.jass_function_user)
        this.#token(ctx, JassRule.lparen, TokenLegend.jass_lparen)
        this.#token(ctx, JassRule.rparen, TokenLegend.jass_rparen)
        this.#tokens(ctx, JassRule.comma, TokenLegend.jass_comma)
        this.#nodes(ctx, JassRule.expression)
    }

    [JassRule.statement](ctx: JassCstNode) {
        this.#nodes(ctx, JassRule.if_statement)
        this.#nodes(ctx, JassRule.set_statement)
        this.#nodes(ctx, JassRule.call_statement)
        this.#nodes(ctx, JassRule.loop_statement)
        this.#nodes(ctx, JassRule.exitwhen_statement)
        this.#nodes(ctx, JassRule.return_statement)
    }

    [JassRule.call_statement](ctx: JassCstNode) {
        //console.log(JassRule.call_statement, ctx)
        this.#token(ctx, JassRule.debug, TokenLegend.jass_debug)
        this.#token(ctx, JassRule.call, TokenLegend.jass_call)
        this.#node(ctx, JassRule.function_call)
    }

    [JassRule.set_statement](ctx: JassCstNode) {
        // console.log(JassRule.set_statement, ctx);
        this.#token(ctx, JassRule.set, TokenLegend.jass_set)
        this.#token(ctx, JassRule.identifier, TokenLegend.jass_variable_local)
        this.#token(ctx, JassRule.assign, TokenLegend.jass_assign)
        this.#node(ctx, JassRule.expression)
        this.#node(ctx, JassRule.arrayaccess)
    }

    [JassRule.loop_statement](ctx: JassCstNode) {
        this.#token(ctx, JassRule.loop, TokenLegend.jass_loop)
        this.#token(ctx, JassRule.endloop, TokenLegend.jass_endloop)
        ctx[JassRule.statement]?.map(item => this.visit(item))
    }

    [JassRule.exitwhen_statement](ctx: JassCstNode) {
        this.#token(ctx, JassRule.exitwhen, TokenLegend.jass_loop)
        this.#node(ctx, JassRule.expression)
    }

    [JassRule.return_statement](ctx: JassCstNode) {
        this.#token(ctx, JassRule.return, TokenLegend.jass_return)
        this.#node(ctx, JassRule.expression)
    }

    [JassRule.if_statement](ctx: JassCstNode) {
        // console.log(JassRule.if_statement, ctx);
        this.#token(ctx, JassRule.if, TokenLegend.jass_if)
        this.#token(ctx, JassRule.then, TokenLegend.jass_then)
        this.#token(ctx, JassRule.endif, TokenLegend.jass_endif)
        this.#node(ctx, JassRule.expression)
        this.#nodes(ctx, JassRule.statement)
        this.#nodes(ctx, JassRule.elseif_statement)
        this.#node(ctx, JassRule.else_statement)
    }

    [JassRule.elseif_statement](ctx: JassCstNode) {
        this.visit(ctx[JassRule.expression]!)
        this.#token(ctx, JassRule.elseif, TokenLegend.jass_elseif)
        this.#token(ctx, JassRule.then, TokenLegend.jass_then)
        this.#nodes(ctx, JassRule.statement)
    }

    [JassRule.else_statement](ctx: JassCstNode) {
        this.#mark(ctx[JassRule.else]?.[0], TokenLegend.jass_else)
        this.#nodes(ctx, JassRule.statement)
    }

    [JassRule.expression](ctx: JassCstNode) {
        //console.log(JassRule.expression, ctx);
        this.#tokens(ctx, JassRule.and, TokenLegend.jass_and)
        this.#tokens(ctx, JassRule.or, TokenLegend.jass_or)
        this.#tokens(ctx, JassRule.equals, TokenLegend.jass_equals)
        this.#tokens(ctx, JassRule.notequals, TokenLegend.jass_notequals)
        this.#tokens(ctx, JassRule.lessorequal, TokenLegend.jass_lessorequal)
        this.#tokens(ctx, JassRule.great, TokenLegend.jass_great)
        this.#tokens(ctx, JassRule.greatorequal, TokenLegend.jass_greatorequal)
        this.#nodes(ctx, JassRule.addition)
    }

    [JassRule.primary](ctx: JassCstNode) {
        //console.log(JassRule.primary, ctx);
        this.#string(ctx)
        this.#token(ctx, JassRule.sub, TokenLegend.jass_sub)
        this.#token(ctx, JassRule.integer, TokenLegend.jass_integer)
        this.#token(ctx, JassRule.real, TokenLegend.jass_real)
        this.#token(ctx, JassRule.idliteral, TokenLegend.jass_idliteral)
        this.#token(ctx, JassRule.function, TokenLegend.jass_function)
        this.#token(ctx, JassRule.not, TokenLegend.jass_not)
        this.#token(ctx, JassRule.null, TokenLegend.jass_null)
        this.#token(ctx, JassRule.true, TokenLegend.jass_true)
        this.#token(ctx, JassRule.false, TokenLegend.jass_false)
        this.#token(ctx, JassRule.identifier, TokenLegend.jass_variable_local)
        this.#node(ctx, JassRule.arrayaccess)
        this.#node(ctx, JassRule.function_call)
        this.#node(ctx, JassRule.expression)
        this.#node(ctx, JassRule.primary)
    }

    [JassRule.addition](ctx: JassCstNode) {
        // console.log(JassRule.addition, ctx);
        this.#tokens(ctx, JassRule.add, TokenLegend.jass_add)
        this.#tokens(ctx, JassRule.sub, TokenLegend.jass_sub)
        this.#nodes(ctx, JassRule.multiplication)
    }

    [JassRule.multiplication](ctx: JassCstNode) {
        // console.log(JassRule.multiplication, ctx);
        this.#tokens(ctx, JassRule.mult, TokenLegend.jass_mult)
        this.#tokens(ctx, JassRule.div, TokenLegend.jass_div)
        this.#nodes(ctx, JassRule.primary)
    }

    [JassRule.arrayaccess](ctx: JassCstNode) {
        // console.log(JassRule.arrayaccess, ctx);
        this.#token(ctx, JassRule.lsquareparen, TokenLegend.jass_lsquareparen)
        this.#token(ctx, JassRule.rsquareparen, TokenLegend.jass_rsquareparen)
        this.#node(ctx, JassRule.expression)
    }

    [JassRule.end]() {
    }
}
