// noinspection DuplicatedCode

import JassRule from './jass-rule'
import type JassCstNode from './jass-cst-node'
import JassParser from './jass-parser'

const parser = new JassParser()
const ParserVisitor = parser.getBaseCstVisitorConstructor()

export class JassVisitorDocs extends ParserVisitor {
    constructor() {
        super()
        this.validateVisitor()
    }

    [JassRule.jass](ctx: JassCstNode) {
        //console.log(JassRule.jass, ctx)
        return ctx
    }

    [JassRule.jass_constant](ctx: JassCstNode) {
        //console.log(JassRule.jass_constant, ctx)
        return ctx
    }

    [JassRule.native_declare](ctx: JassCstNode) {
        //console.log(JassRule.native_declare, ctx)
        return ctx
    }

    [JassRule.function_declare](ctx: JassCstNode) {
        //console.log(JassRule.function_declare, ctx)
        return ctx
    }

    [JassRule.function_head](ctx: JassCstNode) {
        //console.log(JassRule.function_head, ctx)
        return ctx
    }

    [JassRule.variable_declare](ctx: JassCstNode) {
        //console.log(JassRule.variable_declare, ctx);
        return ctx
    }

    [JassRule.globals_declare](ctx: JassCstNode) {
        return ctx
    }

    [JassRule.type_declare](ctx: JassCstNode) {
        return ctx
    }

    [JassRule.typedname](ctx: JassCstNode) {
        return ctx
    }

    [JassRule.function_call](ctx: JassCstNode) {
        return ctx
    }

    [JassRule.statement](ctx: JassCstNode) {
        return ctx
    }

    [JassRule.call_statement](ctx: JassCstNode) {
        return ctx
    }

    [JassRule.set_statement](ctx: JassCstNode) {
        return ctx
    }

    [JassRule.loop_statement](ctx: JassCstNode) {
        return ctx
    }

    [JassRule.exitwhen_statement](ctx: JassCstNode) {
        return ctx
    }

    [JassRule.return_statement](ctx: JassCstNode) {
        return ctx
    }

    [JassRule.if_statement](ctx: JassCstNode) {
        return ctx
    }

    [JassRule.elseif_statement](ctx: JassCstNode) {
        return ctx
    }

    [JassRule.else_statement](ctx: JassCstNode) {
        return ctx
    }

    [JassRule.expression](ctx: JassCstNode) {
        return ctx
    }

    [JassRule.primary](ctx: JassCstNode) {
        return ctx
    }

    [JassRule.addition](ctx: JassCstNode) {
        return ctx
    }

    [JassRule.multiplication](ctx: JassCstNode) {
        return ctx
    }

    [JassRule.arrayaccess](ctx: JassCstNode) {
        return ctx
    }

    [JassRule.end](ctx: JassCstNode) {
        return ctx
    }
}
