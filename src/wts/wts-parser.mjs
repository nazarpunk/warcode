import {CstParser, EOF} from "chevrotain";
import WtsLexer, {
    WtsTokenList, WtsTokenMap
} from "./wts-lexer.mjs";
import Rule from "./wts-parser-rule-name.mjs";
import ParserError from "../utils/parser-error.mjs";
import ParserErrorType from "../utils/parser-error-type.mjs";

export class WtsParser extends CstParser {
    /**@type {import('../utils/parser-error.mjs').default[]} */
    errorlist = [];

    set inputText(text) {
        this.errorlist = [];
        this.input = WtsLexer.tokenize(text).tokens;
    }

    constructor() {
        super(WtsTokenList, {
            recoveryEnabled: true,
            errorMessageProvider: {
                buildMismatchTokenMessage: options => {
                    console.error('MismatchToken');
                    console.log(options);
                    this.errorlist.push(new ParserError(ParserErrorType.MismatchToken, options.actual));
                    return null;
                },
                buildNotAllInputParsedMessage: options => {
                    console.error('NotAllInputParsed');
                    console.log(options);
                    return null;
                },
                buildNoViableAltMessage: options => {
                    console.error('NoViableAlt');
                    console.log(options);
                    return null;
                },
                buildEarlyExitMessage: options => {
                    console.error('EarlyExit');
                    console.log(options);
                    return null;
                },
            },
        });

        const $ = this;

        $.RULE(Rule.wts, () => $.MANY(() => $.SUBRULE($[Rule.block])));

        $.RULE(Rule.block, () => {
            $.CONSUME(WtsTokenMap.string);
            $.CONSUME(WtsTokenMap.index);
            $.MANY(() => $.OR([
                {ALT: () => $.CONSUME(WtsTokenMap.comment)},
            ]));
            $.CONSUME(WtsTokenMap.lparen);
            $.CONSUME(WtsTokenMap.text);
            $.CONSUME(WtsTokenMap.rparen);
        });

        this.performSelfAnalysis();
    }
}