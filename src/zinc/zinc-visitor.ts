// noinspection DuplicatedCode

import ZincRule from './zinc-rule'
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
import i18next from 'i18next'
import {i18n} from '../utils/i18n'
import ExtSettings from '../utils/ext-settings'
import {VisitNode, VisitNodes, VisitToken, VisitTokens} from '../utils/ext-visitor'
import ITokenToRanges from '../utils/vscode/i-token-to-ranges'

const parser = new ZincParser()
const visitor = parser.getBaseCstVisitorConstructor()

export default class ZincVisitor extends visitor implements IVisitor {
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

    #token(ctx: CstNode, rule: ZincRule, type: TokenLegend): IToken | null {
        return VisitToken(this.document, this.semantic, ctx, rule, type)
    }

    #tokens(ctx: CstNode, rule: ZincRule, type: TokenLegend) {
        return VisitTokens(this.document, this.semantic, ctx, rule, type)
    }

    #node(ctx: CstNode, rule: ZincRule, param?: any) {
        return VisitNode(this, ctx, rule, param)
    }

    #nodes(ctx: CstNode, rule: ZincRule, param?: any) {
        return VisitNodes(this, ctx, rule, param)
    }

    [ZincRule.zinc](ctx: CstNode) {
        //console.log(ZincRule.zinc, ctx);
        this.#nodes(ctx, ZincRule.library_declare)
    }

    [ZincRule.library_declare](ctx: CstNode) {
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

    [ZincRule.library_requires](ctx: CstNode) {
        this.#token(ctx, ZincRule.optional, TokenLegend.zinc_optional)
        this.#token(ctx, ZincRule.identifier, TokenLegend.zinc_function_native)
    }

    [ZincRule.library_root](ctx: CstNode) {
        //console.log(ZincRule.library_root, ctx)
        this.#node(ctx, ZincRule.library_constant)
        this.#node(ctx, ZincRule.access_scope)
    }

    [ZincRule.library_constant](ctx: CstNode) {
        //console.log(ZincRule.library_constant, ctx)
        this.#token(ctx, ZincRule.constant, TokenLegend.zinc_constant)
        this.#node(ctx, ZincRule.variable_declare)
        this.#node(ctx, ZincRule.function_declare)
    }

    [ZincRule.access_scope](ctx: CstNode) {
        //console.log(ZincRule.access_scope, ctx)
        this.#token(ctx, ZincRule.public, TokenLegend.zinc_public)
        this.#token(ctx, ZincRule.private, TokenLegend.zinc_private)
        this.#token(ctx, ZincRule.lcurlyparen, TokenLegend.zinc_lcurlyparen)
        this.#token(ctx, ZincRule.rcurlyparen, TokenLegend.zinc_rcurlyparen)
        this.#nodes(ctx, ZincRule.library_root)
    }

    [ZincRule.function_declare](ctx: CstNode) {
        //console.log(ZincRule.function_declare, ctx)
        this.#token(ctx, ZincRule.function, TokenLegend.zinc_function)
        this.#token(ctx, ZincRule.identifier_name, TokenLegend.zinc_function_user)
        this.#token(ctx, ZincRule.returns, TokenLegend.zinc_returns)
        this.#token(ctx, ZincRule.identifier_returns, TokenLegend.zinc_type_name)
        this.#token(ctx, ZincRule.comma, TokenLegend.zinc_comma)
        this.#token(ctx, ZincRule.lparen, TokenLegend.zinc_lparen)
        this.#token(ctx, ZincRule.rparen, TokenLegend.zinc_rparen)
        this.#token(ctx, ZincRule.lcurlyparen, TokenLegend.zinc_lcurlyparen)
        this.#token(ctx, ZincRule.rcurlyparen, TokenLegend.zinc_rcurlyparen)
        this.#nodes(ctx, ZincRule.function_arg)
        this.#nodes(ctx, ZincRule.variable_declare)
        this.#nodes(ctx, ZincRule.statement)
    }

    [ZincRule.function_arg](ctx: CstNode) {
        //console.log(ZincRule.function_arg, ctx)
        this.#token(ctx, ZincRule.identifier_type, TokenLegend.zinc_type_name)
        this.#token(ctx, ZincRule.identifier_name, TokenLegend.zinc_argument)
    }

    [ZincRule.function_call](ctx: CstNode) {
        this.#token(ctx, ZincRule.identifier, TokenLegend.zinc_function_user)
        this.#token(ctx, ZincRule.lparen, TokenLegend.zinc_lparen)
        this.#token(ctx, ZincRule.rparen, TokenLegend.zinc_rparen)
        this.#tokens(ctx, ZincRule.comma, TokenLegend.zinc_comma)
        this.#nodes(ctx, ZincRule.expression)
        this.#nodes(ctx, ZincRule.function_declare)
    }

    [ZincRule.variable_declare](ctx: CstNode) {
        //console.log(ZincRule.variable_declare, ctx)
        this.#token(ctx, ZincRule.semicolon, TokenLegend.zinc_semicolon)
        this.#tokens(ctx, ZincRule.comma, TokenLegend.zinc_comma)
        this.#token(ctx, ZincRule.identifier, TokenLegend.zinc_type_name)
        this.#nodes(ctx, ZincRule.variable_set)
    }

    [ZincRule.variable_set](ctx: CstNode) {
        //console.log(ZincRule.variable_set, ctx)
        this.#token(ctx, ZincRule.assign, TokenLegend.zinc_assign)
        this.#token(ctx, ZincRule.identifier, TokenLegend.zinc_variable_local)
        this.#tokens(ctx, ZincRule.lsquareparen, TokenLegend.zinc_lsquareparen)
        this.#tokens(ctx, ZincRule.rsquareparen, TokenLegend.zinc_rsquareparen)
        this.#node(ctx, ZincRule.arrayaccess)
        this.#nodes(ctx, ZincRule.expression)
    }

    [ZincRule.set_statement](ctx: CstNode) {
        //console.log(ZincRule.set_statement, ctx)
        this.#token(ctx, ZincRule.assign, TokenLegend.zinc_assign)
        this.#token(ctx, ZincRule.add_assign, TokenLegend.zinc_add_assign)
        this.#token(ctx, ZincRule.sub_assign, TokenLegend.zinc_sub_assign)
        this.#token(ctx, ZincRule.mult_assign, TokenLegend.zinc_mult_assign)
        this.#token(ctx, ZincRule.div_assign, TokenLegend.zinc_div_assign)
        this.#token(ctx, ZincRule.identifier, TokenLegend.zinc_variable_local)
        this.#node(ctx, ZincRule.expression)
        this.#nodes(ctx, ZincRule.arrayaccess)
    }

    [ZincRule.for_statement](ctx: CstNode) {
        //console.log(ZincRule.for_statement, ctx)
        this.#token(ctx, ZincRule.for, TokenLegend.zinc_for)
        this.#token(ctx, ZincRule.lparen, TokenLegend.zinc_lparen)
        this.#token(ctx, ZincRule.rparen, TokenLegend.zinc_rparen)
        this.#token(ctx, ZincRule.lcurlyparen, TokenLegend.zinc_lcurlyparen)
        this.#token(ctx, ZincRule.rcurlyparen, TokenLegend.zinc_rcurlyparen)
        this.#token(ctx, ZincRule.identifier, TokenLegend.zinc_variable_local)
        this.#tokens(ctx, ZincRule.less, TokenLegend.zinc_less)
        this.#tokens(ctx, ZincRule.lessorequal, TokenLegend.zinc_lessorequal)
        this.#tokens(ctx, ZincRule.great, TokenLegend.zinc_great)
        this.#tokens(ctx, ZincRule.greatorequal, TokenLegend.zinc_greatorequal)
        this.#nodes(ctx, ZincRule.addition)
        this.#nodes(ctx, ZincRule.statement)
    }

    [ZincRule.return_statement](ctx: CstNode) {
        this.#token(ctx, ZincRule.return, TokenLegend.zinc_return)
        this.#token(ctx, ZincRule.semicolon, TokenLegend.zinc_semicolon)
        this.#node(ctx, ZincRule.expression)
    }

    [ZincRule.if_statement](ctx: CstNode) {
        this.#token(ctx, ZincRule.if, TokenLegend.zinc_if)
        this.#token(ctx, ZincRule.lparen, TokenLegend.zinc_lparen)
        this.#token(ctx, ZincRule.rparen, TokenLegend.zinc_rparen)
        this.#token(ctx, ZincRule.lcurlyparen, TokenLegend.zinc_lcurlyparen)
        this.#token(ctx, ZincRule.rcurlyparen, TokenLegend.zinc_rcurlyparen)
        this.#node(ctx, ZincRule.expression)
        this.#nodes(ctx, ZincRule.statement)
        this.#node(ctx, ZincRule.else_statement)
    }

    [ZincRule.else_statement](ctx: CstNode) {
        this.#token(ctx, ZincRule.else, TokenLegend.zinc_else)
        this.#token(ctx, ZincRule.lcurlyparen, TokenLegend.zinc_lcurlyparen)
        this.#token(ctx, ZincRule.rcurlyparen, TokenLegend.zinc_rcurlyparen)
        this.#nodes(ctx, ZincRule.statement)
    }

    [ZincRule.while_statement](ctx: CstNode) {
        this.#token(ctx, ZincRule.while, TokenLegend.zinc_while)
        this.#token(ctx, ZincRule.lparen, TokenLegend.zinc_lparen)
        this.#token(ctx, ZincRule.rparen, TokenLegend.zinc_rparen)
        this.#token(ctx, ZincRule.lcurlyparen, TokenLegend.zinc_lcurlyparen)
        this.#token(ctx, ZincRule.rcurlyparen, TokenLegend.zinc_rcurlyparen)
        this.#nodes(ctx, ZincRule.expression)
        this.#nodes(ctx, ZincRule.statement)
    }

    [ZincRule.statement](ctx: CstNode) {
        //console.log(ZincRule.statement, ctx)
        this.#token(ctx, ZincRule.break, TokenLegend.zinc_break)
        this.#tokens(ctx, ZincRule.semicolon, TokenLegend.zinc_semicolon)
        this.#node(ctx, ZincRule.function_call)
        this.#node(ctx, ZincRule.if_statement)
        this.#node(ctx, ZincRule.set_statement)
        this.#node(ctx, ZincRule.for_statement)
        this.#node(ctx, ZincRule.while_statement)
        this.#node(ctx, ZincRule.return_statement)
    }

    [ZincRule.arrayaccess](ctx: CstNode) {
        this.#tokens(ctx, ZincRule.lsquareparen, TokenLegend.zinc_lsquareparen)
        this.#tokens(ctx, ZincRule.rsquareparen, TokenLegend.zinc_rsquareparen)
        this.#nodes(ctx, ZincRule.addition)
    }

    [ZincRule.expression](ctx: CstNode) {
        this.#tokens(ctx, ZincRule.and, TokenLegend.zinc_and)
        this.#tokens(ctx, ZincRule.or, TokenLegend.zinc_or)
        this.#tokens(ctx, ZincRule.equals, TokenLegend.zinc_equals)
        this.#tokens(ctx, ZincRule.notequals, TokenLegend.zinc_notequals)
        this.#tokens(ctx, ZincRule.lessorequal, TokenLegend.zinc_lessorequal)
        this.#tokens(ctx, ZincRule.great, TokenLegend.zinc_great)
        this.#tokens(ctx, ZincRule.greatorequal, TokenLegend.zinc_greatorequal)
        this.#nodes(ctx, ZincRule.addition)
    }

    [ZincRule.addition](ctx: CstNode) {
        this.#tokens(ctx, ZincRule.add, TokenLegend.zinc_add)
        this.#tokens(ctx, ZincRule.sub, TokenLegend.zinc_sub)
        this.#nodes(ctx, ZincRule.multiplication)
    }

    [ZincRule.multiplication](ctx: CstNode) {
        this.#tokens(ctx, ZincRule.mult, TokenLegend.zinc_mult)
        this.#tokens(ctx, ZincRule.div, TokenLegend.zinc_div)
        this.#nodes(ctx, ZincRule.primary)
    }

    [ZincRule.primary](ctx: CstNode) {
        //console.log(ZincRule.primary, ctx)
        this.#token(ctx, ZincRule.function, TokenLegend.zinc_function)
        this.#token(ctx, ZincRule.not, TokenLegend.zinc_not)
        this.#token(ctx, ZincRule.null, TokenLegend.zinc_null)
        this.#token(ctx, ZincRule.true, TokenLegend.zinc_true)
        this.#token(ctx, ZincRule.false, TokenLegend.zinc_false)
        this.#token(ctx, ZincRule.identifier, TokenLegend.zinc_variable_local)
        this.#node(ctx, ZincRule.primary)
        this.#node(ctx, ZincRule.primary_div)

        const string = this.#token(ctx, ZincRule.stringliteral, TokenLegend.jass_stringliteral)
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

    [ZincRule.primary_div](ctx: CstNode) {
        this.#token(ctx, ZincRule.sub, TokenLegend.zinc_sub)
        this.#token(ctx, ZincRule.integer, TokenLegend.zinc_integer)
        this.#token(ctx, ZincRule.real, TokenLegend.zinc_real)
        this.#token(ctx, ZincRule.rawcode, TokenLegend.zinc_rawcode)
        this.#token(ctx, ZincRule.lparen, TokenLegend.zinc_lparen)
        this.#token(ctx, ZincRule.rparen, TokenLegend.zinc_rparen)
        this.#token(ctx, ZincRule.identifier, TokenLegend.zinc_variable_local)
        this.#node(ctx, ZincRule.arrayaccess)
        this.#node(ctx, ZincRule.function_call)
        this.#node(ctx, ZincRule.expression)
    }
}
