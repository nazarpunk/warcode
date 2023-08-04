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

interface Variable {
    type: IToken | null,
    name: IToken | null,
    array: IToken | null
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

    #mark(token: IToken | undefined | null, type: number) {
        if (!token || isNaN(token.startOffset)) return
        const p = this.document.positionAt(token.startOffset)
        this.builder.push(p.line, p.character, token.image.length, type)
    }

    #token(ctx: JassCstNode, rule: JassRule, type?: TokenLegend): IToken | null {
        const token = ctx[rule]?.[0] as IToken
        if (!token || isNaN(token.startOffset) || token.isInsertedInRecovery) return null
        const p = this.document.positionAt(token.startOffset)
        if (type != undefined) this.builder.push(p.line, p.character, token.image.length, type)
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

    #nodes<T>(ctx: JassCstNode, rule: JassRule): T[] {
        const nodes = ctx[rule] as CstNode[]
        const out = []
        if (!nodes) return []
        for (const node of nodes) out.push(this.visit(node))
        return out
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
        this.#tokens(ctx, JassRule.local, TokenLegend.jass_local)

        // declare
        for (const variable of this.#nodes<Variable>(ctx, JassRule.variable_declare)) {
            const {type, name} = variable
            this.#mark(type, TokenLegend.jass_type_name)
            this.#mark(name, TokenLegend.jass_variable_local)
            // local check: local redeclare arg
            if (!name) continue
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

        // --- statement
        this.#nodes(ctx, JassRule.statement)
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

        if (!this.#token(ctx, JassRule.takes_nothing, TokenLegend.jass_type_name)) {
            this.#tokens(ctx, JassRule.comma, TokenLegend.jass_comma)

            for (const arg of this.#nodes<Variable>(ctx, JassRule.function_arg)) {
                const {name} = arg
                if (name) (argMap[name.image] ??= []).push(name)
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

    [JassRule.function_arg](ctx: JassCstNode): Variable {
        return {
            type: this.#token(ctx, JassRule.identifier_type, TokenLegend.jass_type_name)!,
            name: this.#token(ctx, JassRule.identifier_name, TokenLegend.jass_argument)!,
            array: null
        }
    }

    [JassRule.variable_declare](ctx: JassCstNode): Variable {
        //console.log(JassRule.variable_declare, ctx);
        const assign = this.#token(ctx, JassRule.assign, TokenLegend.jass_assign)
        const array = this.#token(ctx, JassRule.array, TokenLegend.jass_array)

        // check array assing
        if (assign && array) {
            this.diagnostics.push({
                message: i18next.t(i18n.arrayInitializeError),
                range: new Range(
                    this.document.positionAt(array.startOffset),
                    this.document.positionAt(array.startOffset + array.image.length)
                ),
                severity: DiagnosticSeverity.Error
            })
        }

        this.#node(ctx, JassRule.expression)

        return {
            type: this.#token(ctx, JassRule.identifier_type),
            name: this.#token(ctx, JassRule.identifier_name),
            array: array,
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

        for (const variable of this.#nodes<Variable>(ctx, JassRule.variable_declare)) {
            const {type, name} = variable
            this.#mark(type, TokenLegend.jass_type_name)
            this.#mark(name, TokenLegend.jass_variable_global)
            if (globalsSymbol && type && name) {
                globalsSymbol.children.push(this.#documentSymbol(name.image, type.image, SymbolKind.Variable, type, undefined, name))
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
        this.#token(ctx, JassRule.lsquareparen, TokenLegend.jass_lsquareparen)
        this.#token(ctx, JassRule.rsquareparen, TokenLegend.jass_rsquareparen)
        this.#node(ctx, JassRule.addition)
        this.#node(ctx, JassRule.expression)
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
        //console.log(JassRule.expression, ctx)
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
        this.#token(ctx, JassRule.identifier, TokenLegend.jass_variable_local)
        this.#token(ctx, JassRule.not, TokenLegend.jass_not)
        this.#token(ctx, JassRule.null, TokenLegend.jass_null)
        this.#token(ctx, JassRule.true, TokenLegend.jass_true)
        this.#token(ctx, JassRule.false, TokenLegend.jass_false)
        this.#node(ctx, JassRule.primary)
        this.#node(ctx, JassRule.primary_sub)
    }

    [JassRule.primary_sub](ctx: JassCstNode) {
        this.#token(ctx, JassRule.sub, TokenLegend.jass_sub)
        this.#token(ctx, JassRule.integer, TokenLegend.jass_integer)
        this.#token(ctx, JassRule.real, TokenLegend.jass_real)
        this.#token(ctx, JassRule.rawcode, TokenLegend.jass_rawcode)
        this.#token(ctx, JassRule.lparen, TokenLegend.jass_lparen)
        this.#token(ctx, JassRule.rparen, TokenLegend.jass_rparen)
        this.#token(ctx, JassRule.lsquareparen, TokenLegend.jass_lsquareparen)
        this.#token(ctx, JassRule.rsquareparen, TokenLegend.jass_rsquareparen)
        this.#token(ctx, JassRule.identifier, TokenLegend.jass_variable_local)
        this.#token(ctx, JassRule.function, TokenLegend.jass_function)
        this.#node(ctx, JassRule.addition)
        this.#node(ctx, JassRule.expression)
        this.#node(ctx, JassRule.function_call)
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

    [JassRule.end]() {
    }
}
