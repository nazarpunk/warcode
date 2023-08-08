// noinspection DuplicatedCode

import JassRule from './jass-rule'
import JassParser from './jass-parser'
import {CstNode} from 'chevrotain'

const parser = new JassParser()
const ParserVisitor = parser.getBaseCstVisitorConstructor()

export default class JassVisitorDocs extends ParserVisitor {
    constructor() {
        super()
        this.validateVisitor()
    }

    [JassRule.jass](ctx: CstNode) {
        //console.log(JassRule.jass, ctx)
        // @ts-ignore
        ctx[JassRule.jass_constant]?.map(item => this.visit(item))
        // @ts-ignore
        ctx[JassRule.type_declare]?.map(item => this.visit(item))
        // @ts-ignore
        ctx[JassRule.globals_declare]?.map(item => this.visit(item))
    }

    [JassRule.jass_constant](ctx: CstNode) {
        //console.log(JassRule.jass_constant, ctx)
        return ctx
    }

    [JassRule.native_declare](ctx: CstNode) {
        //console.log(JassRule.native_declare, ctx)
        return ctx
    }

    [JassRule.function_declare](ctx: CstNode) {
        //console.log(JassRule.function_declare, ctx)
        return ctx
    }

    [JassRule.function_head](ctx: CstNode) {
        //console.log(JassRule.function_head, ctx)
        return ctx
    }

    [JassRule.function_arg](ctx: CstNode) {
        return ctx
    }

    [JassRule.variable_declare](ctx: CstNode) {
        //console.log(JassRule.variable_declare, ctx);
        return ctx
    }

    [JassRule.globals_declare](ctx: CstNode) {
        //console.log(JassRule.globals_declare, ctx)
        return ctx
    }

    [JassRule.type_declare](ctx: CstNode) {
        return ctx
    }

    [JassRule.function_call](ctx: CstNode) {
        return ctx
    }

    [JassRule.statement](ctx: CstNode) {
        return ctx
    }

    [JassRule.call_statement](ctx: CstNode) {
        return ctx
    }

    [JassRule.set_statement](ctx: CstNode) {
        return ctx
    }

    [JassRule.loop_statement](ctx: CstNode) {
        return ctx
    }

    [JassRule.exitwhen_statement](ctx: CstNode) {
        return ctx
    }

    [JassRule.return_statement](ctx: CstNode) {
        return ctx
    }

    [JassRule.if_statement](ctx: CstNode) {
        return ctx
    }

    [JassRule.elseif_statement](ctx: CstNode) {
        return ctx
    }

    [JassRule.else_statement](ctx: CstNode) {
        return ctx
    }

    [JassRule.expression](ctx: CstNode) {
        return ctx
    }

    [JassRule.primary](ctx: CstNode) {
        return ctx
    }

    [JassRule.primary_sub](ctx: CstNode) {
        return ctx
    }

    [JassRule.addition](ctx: CstNode) {
        return ctx
    }

    [JassRule.multiplication](ctx: CstNode) {
        return ctx
    }

    [JassRule.end](ctx: CstNode) {
        return ctx
    }
}
