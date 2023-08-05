// noinspection DuplicatedCode

import {
    Diagnostic,
    DiagnosticSeverity,
    DocumentSymbol,
    FoldingRange,
    Range,
    SemanticTokensBuilder,
    SymbolKind,
    TextDocument
} from 'vscode'
import TokenLegend from '../semantic/token-legend'
import JassRule from './jass-rule'
import {type IToken} from '@chevrotain/types'
import JassParser from './jass-parser'
import i18next from 'i18next'
import {i18n} from '../utils/i18n'
import {IVisitor} from '../utils/ext-provider'
import {CstNode} from 'chevrotain'
import ExtSettings from '../utils/ext-settings'
import {SemanticIToken, SymbolIToken, VisitNode, VisitNodes, VisitToken, VisitTokens} from '../utils/ext-visitor'
import ITokenToRanges from '../utils/vscode/i-token-to-ranges'

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
    declare semantic: SemanticTokensBuilder
    declare diagnostics: Diagnostic[]
    declare symbols: DocumentSymbol[]
    declare foldings: FoldingRange[]
    declare settings: ExtSettings

    #semantic(token: IToken | null, type: number) {
        return SemanticIToken(this.document, this.semantic, token, type)
    }

    #token(ctx: CstNode, rule: JassRule, type?: TokenLegend): IToken | null {
        return VisitToken(this.document, this.semantic, ctx, rule, type)
    }

    #tokens(ctx: CstNode, rule: JassRule, type?: TokenLegend): IToken[] {
        return VisitTokens(this.document, this.semantic, ctx, rule, type)
    }

    #node<T>(ctx: CstNode, rule: JassRule, param?: any): T | null {
        return VisitNode(this, ctx, rule, param)
    }

    #nodes<T>(ctx: CstNode, rule: JassRule, param?: any): T[] {
        return VisitNodes(this, ctx, rule, param)
    }

    #symbol(name: string, detail: string, kind: SymbolKind, start: IToken, end?: IToken, selection?: IToken): DocumentSymbol {
        return SymbolIToken(this.document, this.foldings, name, detail, kind, start, end, selection)
    }

    [JassRule.jass](ctx: CstNode) {
        //console.log(JassRule.jass, ctx)
        this.#nodes(ctx, JassRule.jass_constant)
        this.#nodes(ctx, JassRule.type_declare)
        this.#nodes(ctx, JassRule.globals_declare)
    }

    [JassRule.jass_constant](ctx: CstNode) {
        //console.log(JassRule.jass_constant, ctx)
        const constant = this.#token(ctx, JassRule.constant, TokenLegend.jass_constant)
        this.#node(ctx, JassRule.function_declare, {constant: constant})
        this.#node(ctx, JassRule.native_declare, {constant: constant})
    }

    [JassRule.native_declare](ctx: CstNode) {
        //console.log(JassRule.native_declare, ctx)
        this.#token(ctx, JassRule.native, TokenLegend.jass_native)
        const head = this.#node<FuncHead>(ctx, JassRule.function_head, {native: true})
        if (!head) return
        const {name, returns} = head
        if (name && returns) this.symbols.push(this.#symbol(name.image, returns.image, SymbolKind.Function, name))
    }

    [JassRule.function_declare](ctx: CstNode) {
        //console.log(JassRule.function_declare, ctx)

        // Cannot return value from function that returns nothing

        // --- head
        const head = this.#node<FuncHead>(ctx, JassRule.function_head)!
        const {name, argMap, returns} = head

        const func = this.#token(ctx, JassRule.function, TokenLegend.jass_function)
        const endfunc = this.#token(ctx, JassRule.endfunction, TokenLegend.jass_endfunction)

        if (func && endfunc && name && returns) {
            this.symbols.push(this.#symbol(name.image, returns.image, SymbolKind.Function, func, endfunc, name))
        }

        const localMap: Record<string, IToken[]> = {}

        // --- locals
        // keyword
        this.#tokens(ctx, JassRule.local, TokenLegend.jass_local)

        // declare
        for (const variable of this.#nodes<Variable>(ctx, JassRule.variable_declare)) {
            const {type, name} = variable
            this.#semantic(type, TokenLegend.jass_type_name)
            this.#semantic(name, TokenLegend.jass_variable_local)
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

    [JassRule.function_head](ctx: CstNode, opts: { native?: boolean }): FuncHead {
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

    [JassRule.function_arg](ctx: CstNode): Variable {
        return {
            type: this.#token(ctx, JassRule.identifier_type, TokenLegend.jass_type_name)!,
            name: this.#token(ctx, JassRule.identifier_name, TokenLegend.jass_argument)!,
            array: null
        }
    }

    [JassRule.variable_declare](ctx: CstNode): Variable {
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

    [JassRule.globals_declare](ctx: CstNode) {
        this.#tokens(ctx, JassRule.constant, TokenLegend.jass_takes)

        const globals = this.#token(ctx, JassRule.globals, TokenLegend.jass_globals)
        const endglobals = this.#token(ctx, JassRule.endglobals, TokenLegend.jass_endglobals)

        let globalsSymbol: DocumentSymbol | undefined

        if (globals && endglobals) {
            globalsSymbol = this.#symbol(globals.image, '', SymbolKind.Namespace, globals, endglobals)
            this.symbols.push(globalsSymbol)
        }

        for (const variable of this.#nodes<Variable>(ctx, JassRule.variable_declare)) {
            const {type, name} = variable
            this.#semantic(type, TokenLegend.jass_type_name)
            this.#semantic(name, TokenLegend.jass_variable_global)
            if (globalsSymbol && type && name) {
                globalsSymbol.children.push(this.#symbol(name.image, type.image, SymbolKind.Variable, type, undefined, name))
            }
        }
    }

    [JassRule.type_declare](ctx: CstNode) {
        const name = this.#token(ctx, JassRule.identifier_name, TokenLegend.jass_type_name)
        const base = this.#token(ctx, JassRule.identifier_base, TokenLegend.jass_type_name)
        if (name && base) this.symbols.push(this.#symbol(name.image, base.image, SymbolKind.TypeParameter, name))

        this.#token(ctx, JassRule.type, TokenLegend.jass_type)
        this.#token(ctx, JassRule.extends, TokenLegend.jass_extends)
    }

    [JassRule.function_call](ctx: CstNode) {
        // console.log(JassRule.function_call, ctx);
        this.#token(ctx, JassRule.identifier, TokenLegend.jass_function_user)
        this.#token(ctx, JassRule.lparen, TokenLegend.jass_lparen)
        this.#token(ctx, JassRule.rparen, TokenLegend.jass_rparen)
        this.#tokens(ctx, JassRule.comma, TokenLegend.jass_comma)
        this.#nodes(ctx, JassRule.expression)
    }

    [JassRule.statement](ctx: CstNode) {
        this.#node(ctx, JassRule.if_statement)
        this.#node(ctx, JassRule.set_statement)
        this.#node(ctx, JassRule.call_statement)
        this.#node(ctx, JassRule.loop_statement)
        this.#node(ctx, JassRule.exitwhen_statement)
        this.#node(ctx, JassRule.return_statement)
    }

    [JassRule.call_statement](ctx: CstNode) {
        //console.log(JassRule.call_statement, ctx)
        this.#token(ctx, JassRule.debug, TokenLegend.jass_debug)
        this.#token(ctx, JassRule.call, TokenLegend.jass_call)
        this.#node(ctx, JassRule.function_call)
    }

    [JassRule.set_statement](ctx: CstNode) {
        // console.log(JassRule.set_statement, ctx);
        this.#token(ctx, JassRule.set, TokenLegend.jass_set)
        this.#token(ctx, JassRule.identifier, TokenLegend.jass_variable_local)
        this.#token(ctx, JassRule.assign, TokenLegend.jass_assign)
        this.#token(ctx, JassRule.lsquareparen, TokenLegend.jass_lsquareparen)
        this.#token(ctx, JassRule.rsquareparen, TokenLegend.jass_rsquareparen)
        this.#node(ctx, JassRule.addition)
        this.#node(ctx, JassRule.expression)
    }

    [JassRule.loop_statement](ctx: CstNode) {
        this.#token(ctx, JassRule.loop, TokenLegend.jass_loop)
        this.#token(ctx, JassRule.endloop, TokenLegend.jass_endloop)
        this.#nodes(ctx, JassRule.statement)
    }

    [JassRule.exitwhen_statement](ctx: CstNode) {
        this.#token(ctx, JassRule.exitwhen, TokenLegend.jass_loop)
        this.#node(ctx, JassRule.expression)
    }

    [JassRule.return_statement](ctx: CstNode) {
        this.#token(ctx, JassRule.return, TokenLegend.jass_return)
        this.#node(ctx, JassRule.expression)
    }

    [JassRule.if_statement](ctx: CstNode) {
        // console.log(JassRule.if_statement, ctx);
        this.#token(ctx, JassRule.if, TokenLegend.jass_if)
        this.#token(ctx, JassRule.then, TokenLegend.jass_then)
        this.#token(ctx, JassRule.endif, TokenLegend.jass_endif)
        this.#node(ctx, JassRule.expression)
        this.#nodes(ctx, JassRule.statement)
        this.#nodes(ctx, JassRule.elseif_statement)
        this.#node(ctx, JassRule.else_statement)
    }

    [JassRule.elseif_statement](ctx: CstNode) {
        this.#token(ctx, JassRule.elseif, TokenLegend.jass_elseif)
        this.#token(ctx, JassRule.then, TokenLegend.jass_then)
        this.#node(ctx, JassRule.expression)
        this.#nodes(ctx, JassRule.statement)
    }

    [JassRule.else_statement](ctx: CstNode) {
        this.#token(ctx, JassRule.else, TokenLegend.jass_else)
        this.#nodes(ctx, JassRule.statement)
    }

    [JassRule.expression](ctx: CstNode) {
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

    [JassRule.primary](ctx: CstNode) {
        //console.log(JassRule.primary, ctx);
        this.#token(ctx, JassRule.identifier, TokenLegend.jass_variable_local)
        this.#token(ctx, JassRule.not, TokenLegend.jass_not)
        this.#token(ctx, JassRule.null, TokenLegend.jass_null)
        this.#token(ctx, JassRule.true, TokenLegend.jass_true)
        this.#token(ctx, JassRule.false, TokenLegend.jass_false)
        this.#node(ctx, JassRule.primary)
        this.#node(ctx, JassRule.primary_sub)

        const string = this.#token(ctx, JassRule.stringliteral, TokenLegend.jass_stringliteral)
        if (string && !this.settings.allowMultiline) {
            const ranges = ITokenToRanges(string, this.document)
            if (ranges.length > 1) {
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

    [JassRule.primary_sub](ctx: CstNode) {
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

    [JassRule.addition](ctx: CstNode) {
        // console.log(JassRule.addition, ctx);
        this.#tokens(ctx, JassRule.add, TokenLegend.jass_add)
        this.#tokens(ctx, JassRule.sub, TokenLegend.jass_sub)
        this.#nodes(ctx, JassRule.multiplication)
    }

    [JassRule.multiplication](ctx: CstNode) {
        // console.log(JassRule.multiplication, ctx);
        this.#tokens(ctx, JassRule.mult, TokenLegend.jass_mult)
        this.#tokens(ctx, JassRule.div, TokenLegend.jass_div)
        this.#nodes(ctx, JassRule.primary)
    }

    [JassRule.end]() {
    }
}
