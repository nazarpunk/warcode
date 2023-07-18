import {createSyntaxDiagramsCode, createToken, CstParser, Lexer, tokenMatcher} from 'chevrotain'

const AdditionOperator = createToken({
    name: "AdditionOperator",
    pattern: Lexer.NA,
});
const Plus = createToken({
    name: "Plus",
    pattern: /\+/,
    categories: AdditionOperator,
});
const Minus = createToken({
    name: "Minus",
    pattern: /-/,
    categories: AdditionOperator,
});

const MultiplicationOperator = createToken({
    name: "MultiplicationOperator",
    pattern: Lexer.NA,
});
const Multi = createToken({
    name: "Multi",
    pattern: /\*/,
    categories: MultiplicationOperator,
});
const Div = createToken({
    name: "Div",
    pattern: /\//,
    categories: MultiplicationOperator,
});

const LParen = createToken({name: "LParen", pattern: /\(/});
const RParen = createToken({name: "RParen", pattern: /\)/});
const NumberLiteral = createToken({
    name: "NumberLiteral",
    pattern: /[1-9]\d*/,
});

const PowerFunc = createToken({name: "PowerFunc", pattern: /power/});
const Comma = createToken({name: "Comma", pattern: /,/});

const WhiteSpace = createToken({
    name: "WhiteSpace",
    pattern: /\s+/,
    group: Lexer.SKIPPED,
});

const allTokens = [
    WhiteSpace, // whitespace is normally very common so it should be placed first to speed up the lexer's performance
    Plus,
    Minus,
    Multi,
    Div,
    LParen,
    RParen,
    NumberLiteral,
    AdditionOperator,
    MultiplicationOperator,
    PowerFunc,
    Comma,
];
const CalculatorLexer = new Lexer(allTokens);

class CalculatorPure extends CstParser {
    constructor() {
        super(allTokens);

        const $ = this;

        $.RULE("expression", () => {
            $.SUBRULE($.additionExpression);
        });

        //  lowest precedence thus it is first in the rule chain
        // The precedence of binary expressions is determined by how far down the Parse Tree
        // The binary expression appears.
        $.RULE("additionExpression", () => {
            $.SUBRULE($.multiplicationExpression, {LABEL: "lhs"});
            $.MANY(() => {
                // consuming 'AdditionOperator' will consume either Plus or Minus as they are subclasses of AdditionOperator
                $.CONSUME(AdditionOperator);
                //  the index "2" in SUBRULE2 is needed to identify the unique position in the grammar during runtime
                $.SUBRULE2($.multiplicationExpression, {LABEL: "rhs"});
            });
        });

        $.RULE("multiplicationExpression", () => {
            $.SUBRULE($.atomicExpression, {LABEL: "lhs"});
            $.MANY(() => {
                $.CONSUME(MultiplicationOperator);
                //  the index "2" in SUBRULE2 is needed to identify the unique position in the grammar during runtime
                $.SUBRULE2($.atomicExpression, {LABEL: "rhs"});
            });
        });

        $.RULE("atomicExpression", () =>
            $.OR([
                // parenthesisExpression has the highest precedence and thus it appears
                // in the "lowest" leaf in the expression ParseTree.
                {ALT: () => $.SUBRULE($.parenthesisExpression)},
                {ALT: () => $.CONSUME(NumberLiteral)},
                {ALT: () => $.SUBRULE($.powerFunction)},
            ])
        );

        $.RULE("parenthesisExpression", () => {
            $.CONSUME(LParen);
            $.SUBRULE($.expression);
            $.CONSUME(RParen);
        });

        $.RULE("powerFunction", () => {
            $.CONSUME(PowerFunc);
            $.CONSUME(LParen);
            $.SUBRULE($.expression, {LABEL: "base"});
            $.CONSUME(Comma);
            $.SUBRULE2($.expression, {LABEL: "exponent"});
            $.CONSUME(RParen);
        });

        this.performSelfAnalysis();
    }
}

const parser = new CalculatorPure([]);

// ----------------- Interpreter -----------------
const BaseCstVisitor = parser.getBaseCstVisitorConstructor();

class CalculatorInterpreter extends BaseCstVisitor {
    constructor() {
        super();
        this.validateVisitor();
    }

    expression(ctx) {
        return this.visit(ctx.additionExpression);
    }

    additionExpression(ctx) {
        let result = this.visit(ctx.lhs);

        // "rhs" key may be undefined as the grammar defines it as optional (MANY === zero or more).
        if (ctx.rhs) {
            ctx.rhs.forEach((rhsOperand, idx) => {
                // there will be one operator for each rhs operand
                let rhsValue = this.visit(rhsOperand);
                let operator = ctx.AdditionOperator[idx];

                if (tokenMatcher(operator, Plus)) {
                    result += rhsValue;
                } else {
                    result -= rhsValue;
                }
            });
        }

        return result;
    }

    multiplicationExpression(ctx) {
        let result = this.visit(ctx.lhs);

        // "rhs" key may be undefined as the grammar defines it as optional (MANY === zero or more).
        if (ctx.rhs) {
            for (const rhsOperand of ctx.rhs) {
                const idx = ctx.rhs.indexOf(rhsOperand);
                // there will be one operator for each rhs operand
                let rhsValue = this.visit(rhsOperand);
                let operator = ctx.MultiplicationOperator[idx];

                if (tokenMatcher(operator, Multi)) {
                    result *= rhsValue;
                } else {
                    result /= rhsValue;
                }
            }
        }

        return result;
    }

    atomicExpression(ctx) {
        if (ctx.parenthesisExpression) {
            // passing an array to "this.visit" is equivalent
            // to passing the array's first element
            return this.visit(ctx.parenthesisExpression);
        } else if (ctx.NumberLiteral) {
            // If a key exists on the ctx, at least one element is guaranteed
            return parseInt(ctx.NumberLiteral[0].image, 10);
        } else if (ctx.powerFunction) {
            return this.visit(ctx.powerFunction);
        }
    }

    parenthesisExpression(ctx) {
        // The ctx will also contain the parenthesis tokens, but we don't care about those
        // in the context of calculating the result.
        return this.visit(ctx.expression);
    }

    powerFunction(ctx) {
        const base = this.visit(ctx.base);
        const exponent = this.visit(ctx.exponent);
        return Math.pow(base, exponent);
    }
}

const iframe = document.createElement('iframe');
iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(createSyntaxDiagramsCode(parser.getSerializedGastProductions()));
document.body.appendChild(iframe);

const visitor = new CalculatorInterpreter()
const text = '2 + 3 * 4';

parser.input = CalculatorLexer.tokenize(text).tokens;
console.log(parser.errors);

const result = visitor.visit(parser.expression());

console.log(result);