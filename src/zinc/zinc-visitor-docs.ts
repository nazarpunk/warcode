// noinspection DuplicatedCode

import ZincRule from './zinc-rule'
import type ZincCstNode from './zinc-cst-node'
import ZincParser from './zinc-parser'
import {Diagnostic, DocumentSymbol, FoldingRange, SemanticTokensBuilder, TextDocument} from 'vscode'
import {IVisitor} from '../utils/ext-provider'

const parser = new ZincParser()
const ParserVisitor = parser.getBaseCstVisitorConstructor()

export class ZincVisitorDocs extends ParserVisitor implements IVisitor {
    constructor() {
        super()
        this.validateVisitor()
    }

    declare document: TextDocument
    declare builder: SemanticTokensBuilder
    declare diagnostics: Diagnostic[]
    declare symbols: DocumentSymbol[]
    declare foldings: FoldingRange[]

    [ZincRule.zinc](ctx: ZincCstNode) {
        //console.log(ZincRule.zinc, ctx);
        ctx[ZincRule.library_declare]?.map(item => this.visit(item))
    }

    [ZincRule.library_declare](ctx: ZincCstNode) {
        //console.log(ZincRule.library_declare, ctx);
        ctx[ZincRule.library_root]?.map(item => this.visit(item))
        return ctx
    }

    [ZincRule.library_constant](ctx: ZincCstNode) {
        //console.log(ZincRule.library_constant, ctx)
        //ctx[ZincRule.access_scope]?.map(item => this.visit(item))
        return ctx
    }

    [ZincRule.access_scope](ctx: ZincCstNode) {
        ctx[ZincRule.library_root]?.map(item => this.visit(item))
        return ctx
    }

    [ZincRule.library_root](ctx: ZincCstNode) {
        ctx[ZincRule.access_scope]?.map(item => this.visit(item))
        return ctx
    }

    [ZincRule.library_requires](ctx: ZincCstNode) {
        return ctx
    }

    [ZincRule.function_declare](ctx: ZincCstNode) {
        return ctx
    }

    [ZincRule.function_call](ctx: ZincCstNode) {
        return ctx
    }

    [ZincRule.function_arg](ctx: ZincCstNode) {
        return ctx
    }

    [ZincRule.variable_declare](ctx: ZincCstNode) {
        return ctx
    }

    [ZincRule.variable_set](ctx: ZincCstNode) {
        return ctx
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

    [ZincRule.return_statement](ctx: ZincCstNode) {
        return ctx
    }

    [ZincRule.if_statement](ctx: ZincCstNode) {
        return ctx
    }

    [ZincRule.else_statement](ctx: ZincCstNode) {
        return ctx
    }

    [ZincRule.expression](ctx: ZincCstNode) {
        return ctx
    }

    [ZincRule.primary](ctx: ZincCstNode) {
        return ctx
    }

    [ZincRule.addition](ctx: ZincCstNode) {
        return ctx
    }

    [ZincRule.multiplication](ctx: ZincCstNode) {
        return ctx
    }

    [ZincRule.arrayaccess](ctx: ZincCstNode) {
        return ctx
    }
}
