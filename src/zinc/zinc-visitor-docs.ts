// noinspection DuplicatedCode

import ZincRule from './zinc-rule'
import ZincParser from './zinc-parser'
import {Diagnostic, DocumentSymbol, FoldingRange, SemanticTokensBuilder, TextDocument} from 'vscode'
import {IVisitor} from '../utils/ext-provider'
import {CstNode} from 'chevrotain'
import ExtSettings from '../utils/ext-settings'

const parser = new ZincParser()
const ParserVisitor = parser.getBaseCstVisitorConstructor()

export default class ZincVisitorDocs extends ParserVisitor implements IVisitor {
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

    [ZincRule.zinc](ctx: CstNode) {
        //console.log(ZincRule.zinc, ctx);
        // @ts-ignore
        ctx[ZincRule.library_declare]?.map(item => this.visit(item))
    }

    [ZincRule.library_declare](ctx: CstNode) {
        //console.log(ZincRule.library_declare, ctx);
        // @ts-ignore
        ctx[ZincRule.library_root]?.map(item => this.visit(item))
        return ctx
    }

    [ZincRule.library_constant](ctx: CstNode) {
        //console.log(ZincRule.library_constant, ctx)
        //ctx[ZincRule.access_scope]?.map(item => this.visit(item))
        return ctx
    }

    [ZincRule.access_scope](ctx: CstNode) {
        // @ts-ignore
        ctx[ZincRule.library_root]?.map(item => this.visit(item))
        return ctx
    }

    [ZincRule.library_root](ctx: CstNode) {
        // @ts-ignore
        ctx[ZincRule.access_scope]?.map(item => this.visit(item))
        return ctx
    }

    [ZincRule.library_requires](ctx: CstNode) {
        return ctx
    }

    [ZincRule.function_declare](ctx: CstNode) {
        return ctx
    }

    [ZincRule.function_call](ctx: CstNode) {
        return ctx
    }

    [ZincRule.function_arg](ctx: CstNode) {
        return ctx
    }

    [ZincRule.variable_declare](ctx: CstNode) {
        return ctx
    }

    [ZincRule.variable_set](ctx: CstNode) {
        return ctx
    }

    [ZincRule.statement](ctx: CstNode) {
        return ctx
    }

    [ZincRule.set_statement](ctx: CstNode) {
        return ctx
    }

    [ZincRule.for_statement](ctx: CstNode) {
        return ctx
    }

    [ZincRule.return_statement](ctx: CstNode) {
        return ctx
    }

    [ZincRule.if_statement](ctx: CstNode) {
        return ctx
    }

    [ZincRule.else_statement](ctx: CstNode) {
        return ctx
    }

    [ZincRule.while_statement](ctx: CstNode) {
        return ctx
    }

    [ZincRule.expression](ctx: CstNode) {
        return ctx
    }

    [ZincRule.addition](ctx: CstNode) {
        return ctx
    }

    [ZincRule.multiplication](ctx: CstNode) {
        return ctx
    }

    [ZincRule.arrayaccess](ctx: CstNode) {
        return ctx
    }

    [ZincRule.primary](ctx: CstNode) {
        return ctx
    }

    [ZincRule.primary_div](ctx: CstNode) {
        return ctx
    }
}
