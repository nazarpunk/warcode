import {JassLex} from "./lexer.ts";
import {JassParser} from "./parser.ts";

const parser = new JassParser();
const ParserVisitor = parser.getBaseCstVisitorConstructor();

class JassVisitor extends ParserVisitor {
    constructor() {
        super()
        this.validateVisitor()
    }

    jass(ctx) {
        return {
            type: "statement",
            statements: ctx.statement.map(statement => {
                console.log(statement);
                return statement;
            })
        };
    }

    statement() {
        console.log('---statement');
    }

    typedef(ctx) {
        console.log('---typedef');
    }

    funcarg(ctx) {
        console.log('---funcarg');
    }

    funcarglist(ctx) {
        console.log('---funcarglist');
    }

    funcreturntype(ctx) {
        console.log('---funcreturntype');
    }

    nativedecl(ctx) {
        console.log('---nativedecl');
    }
}

const visitor = new JassVisitor();

export function toAstVisitor(text) {
    const result = JassLex(text);

    parser.input = result.tokens;
    const cst = parser.jass();
    if (parser.errors.length > 0) for (const error of parser.errors) console.error(error);

    return visitor.visit(cst);
}