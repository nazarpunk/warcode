// noinspection DuplicatedCode

import ZincRule from './zinc-rule'
import type ZincCstNode from './zinc-cst-node'
import ZincParser from './zinc-parser'
import {
    Diagnostic,
    DiagnosticSeverity,
    DocumentSymbol,
    FoldingRange,
    Range,
    SemanticTokensBuilder,
    TextDocument
} from 'vscode'
import {IVisitor} from '../utils/ext-provider'
import TokenLegend from '../semantic/token-legend'
import {IToken} from '@chevrotain/types'
import {CstNode} from 'chevrotain'
import JassCstNode from '../jass/jass-cst-node'
import i18next from 'i18next'
import {i18n} from '../utils/i18n'

const parser = new ZincParser()
const ParserVisitor = parser.getBaseCstVisitorConstructor()

export class ZincVisitor extends ParserVisitor implements IVisitor {
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

    #token(ctx: ZincCstNode, rule: ZincRule, type: TokenLegend): IToken | null {
        const token = ctx[rule]?.[0] as IToken
        if (!token || isNaN(token.startOffset) || token.isInsertedInRecovery) return null
        const p = this.document.positionAt(token.startOffset)
        this.builder.push(p.line, p.character, token.image.length, type)
        return token
    }

    #tokens(ctx: ZincCstNode, rule: ZincRule, type: TokenLegend) {
        const tokens = ctx[rule] as IToken[]
        if (!tokens) return
        for (const token of tokens) {
            const p = this.document.positionAt(token.startOffset)
            this.builder.push(p.line, p.character, token.image.length, type)
        }
    }

    #node(ctx: ZincCstNode, rule: ZincRule, param?: any) {
        const node = ctx[rule]?.[0] as CstNode
        if (!node) return
        return this.visit(node, param)
    }

    #nodes(ctx: ZincCstNode, rule: ZincRule) {
        const nodes = ctx[rule] as CstNode[]
        if (!nodes) return
        for (const node of nodes) this.visit(node)
    }

    #string(ctx: JassCstNode) {
        const strings = ctx[ZincRule.stringliteral]
        if (!strings) return

        for (const string of strings) {
            const start = this.document.positionAt(string.startOffset)
            const end = this.document.positionAt(string.startOffset + string.image.length)
            if (start.line === end.line) {
                this.#mark(string, TokenLegend.zinc_stringliteral)
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

    [ZincRule.zinc](ctx: ZincCstNode) {
        //console.log(ZincRule.zinc, ctx);
        this.#nodes(ctx, ZincRule.library_declare)
    }

    [ZincRule.library_declare](ctx: ZincCstNode) {
        //console.log(ZincRule.library_declare, ctx)
        this.#token(ctx, ZincRule.library, TokenLegend.zinc_library)
        this.#token(ctx, ZincRule.identifier, TokenLegend.zinc_function_native)
        this.#token(ctx, ZincRule.lcurlyparen, TokenLegend.zinc_lcurlyparen)
        this.#token(ctx, ZincRule.rcurlyparen, TokenLegend.zinc_rcurlyparen)
        this.#token(ctx, ZincRule.requires, TokenLegend.zinc_requires)
        this.#token(ctx, ZincRule.comma, TokenLegend.zinc_comma)
        this.#nodes(ctx, ZincRule.library_requires)
        this.#nodes(ctx, ZincRule.library_root)
    }

    [ZincRule.library_requires](ctx: ZincCstNode) {
        this.#token(ctx, ZincRule.optional, TokenLegend.zinc_optional)
        this.#token(ctx, ZincRule.identifier, TokenLegend.zinc_function_native)
    }

    [ZincRule.library_root](ctx: ZincCstNode) {
        //console.log(ZincRule.library_root, ctx)
        this.#node(ctx, ZincRule.library_constant)
        this.#node(ctx, ZincRule.access_scope)
    }

    [ZincRule.library_constant](ctx: ZincCstNode) {
        //console.log(ZincRule.library_constant, ctx)
        this.#token(ctx, ZincRule.constant, TokenLegend.zinc_constant)
        this.#node(ctx, ZincRule.variable_declare)
    }

    [ZincRule.access_scope](ctx: ZincCstNode) {
        //console.log(ZincRule.access_scope, ctx)
        this.#token(ctx, ZincRule.public, TokenLegend.zinc_public)
        this.#token(ctx, ZincRule.private, TokenLegend.zinc_private)
        this.#token(ctx, ZincRule.lcurlyparen, TokenLegend.zinc_lcurlyparen)
        this.#token(ctx, ZincRule.rcurlyparen, TokenLegend.zinc_rcurlyparen)
        this.#nodes(ctx, ZincRule.library_root)
    }

    [ZincRule.function_declare](ctx: ZincCstNode) {
        return ctx
    }

    [ZincRule.function_locals](ctx: ZincCstNode) {
        return ctx
    }

    [ZincRule.typedname](ctx: ZincCstNode) {
        return ctx
    }

    [ZincRule.function_call](ctx: ZincCstNode) {
        this.#token(ctx, ZincRule.identifier, TokenLegend.zinc_function_user)
        this.#token(ctx, ZincRule.lparen, TokenLegend.zinc_lparen)
        this.#token(ctx, ZincRule.rparen, TokenLegend.zinc_rparen)
        this.#tokens(ctx, ZincRule.comma, TokenLegend.zinc_comma)
        this.#nodes(ctx, ZincRule.expression)
    }

    [ZincRule.function_args](ctx: ZincCstNode) {
        return ctx
    }

    [ZincRule.function_returns](ctx: ZincCstNode) {
        return ctx
    }

    [ZincRule.variable_declare](ctx: ZincCstNode) {
        //console.log(ZincRule.variable_declare, ctx)
        this.#token(ctx, ZincRule.semicolon, TokenLegend.zinc_semicolon)
        this.#tokens(ctx, ZincRule.comma, TokenLegend.zinc_comma)
        this.#token(ctx, ZincRule.identifier, TokenLegend.zinc_type_name)
        this.#nodes(ctx, ZincRule.variable_set)
    }

    [ZincRule.variable_set](ctx: ZincCstNode) {
        //console.log(ZincRule.variable_set, ctx)
        this.#token(ctx, ZincRule.assign, TokenLegend.zinc_assign)
        this.#token(ctx, ZincRule.identifier, TokenLegend.zinc_variable_local)
        this.#tokens(ctx, ZincRule.lsquareparen, TokenLegend.zinc_lsquareparen)
        this.#tokens(ctx, ZincRule.rsquareparen, TokenLegend.zinc_rsquareparen)
        this.#nodes(ctx, ZincRule.expression)
    }

    [ZincRule.statement](ctx: ZincCstNode) {
        return ctx
    }

    [ZincRule.call_statement](ctx: ZincCstNode) {
        return ctx
    }

    [ZincRule.set_statement](ctx: ZincCstNode) {
        return ctx
    }

    [ZincRule.loop_statement](ctx: ZincCstNode) {
        return ctx
    }

    [ZincRule.exitwhen_statement](ctx: ZincCstNode) {
        return ctx
    }

    [ZincRule.return_statement](ctx: ZincCstNode) {
        return ctx
    }

    [ZincRule.if_statement](ctx: ZincCstNode) {
        return ctx
    }

    [ZincRule.elseif_statement](ctx: ZincCstNode) {
        return ctx
    }

    [ZincRule.else_statement](ctx: ZincCstNode) {
        return ctx
    }

    [ZincRule.expression](ctx: ZincCstNode) {
        this.#tokens(ctx, ZincRule.and, TokenLegend.zinc_and)
        this.#tokens(ctx, ZincRule.or, TokenLegend.zinc_or)
        this.#tokens(ctx, ZincRule.equals, TokenLegend.zinc_equals)
        this.#tokens(ctx, ZincRule.notequals, TokenLegend.zinc_notequals)
        this.#tokens(ctx, ZincRule.lessorequal, TokenLegend.zinc_lessorequal)
        this.#tokens(ctx, ZincRule.great, TokenLegend.zinc_great)
        this.#tokens(ctx, ZincRule.greatorequal, TokenLegend.zinc_greatorequal)
        this.#nodes(ctx, ZincRule.addition)
    }

    [ZincRule.primary](ctx: ZincCstNode) {
        this.#string(ctx)
        this.#token(ctx, ZincRule.sub, TokenLegend.zinc_sub)
        this.#token(ctx, ZincRule.integer, TokenLegend.zinc_integer)
        this.#token(ctx, ZincRule.real, TokenLegend.zinc_real)
        this.#token(ctx, ZincRule.idliteral, TokenLegend.zinc_idliteral)
        this.#token(ctx, ZincRule.function, TokenLegend.zinc_function)
        this.#token(ctx, ZincRule.not, TokenLegend.zinc_not)

        this.#node(ctx, ZincRule.arrayaccess)
        this.#node(ctx, ZincRule.function_call)
        this.#node(ctx, ZincRule.expression)
        this.#node(ctx, ZincRule.primary)

        const identifier = ctx[ZincRule.identifier]?.[0]
        if (identifier) {
            if (['null', 'true', 'false'].indexOf(identifier.image) < 0) {
                this.#mark(identifier, TokenLegend.zinc_variable_local)
            } else {
                // TODO add colors
                this.#mark(identifier, TokenLegend.zinc_function)
            }
        }
    }

    [ZincRule.addition](ctx: ZincCstNode) {
        this.#tokens(ctx, ZincRule.add, TokenLegend.zinc_add)
        this.#tokens(ctx, ZincRule.sub, TokenLegend.zinc_sub)
        this.#nodes(ctx, ZincRule.multiplication)
    }

    [ZincRule.multiplication](ctx: ZincCstNode) {
        this.#tokens(ctx, ZincRule.mult, TokenLegend.zinc_mult)
        this.#tokens(ctx, ZincRule.div, TokenLegend.zinc_div)
        this.#nodes(ctx, ZincRule.primary)
    }

    [ZincRule.arrayaccess](ctx: ZincCstNode) {
        this.#token(ctx, ZincRule.lsquareparen, TokenLegend.zinc_lsquareparen)
        this.#token(ctx, ZincRule.rsquareparen, TokenLegend.zinc_rsquareparen)
        this.#node(ctx, ZincRule.expression)
    }
}
