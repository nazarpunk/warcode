import {CstParser, ParserMethod} from "chevrotain";
import ParserError from "../utils/parser-error";
import ParserErrorType from "../utils/parser-error-type";
import WtsRule from "./wts-rule";
import WtsTokens from "./wts-tokens";

export class WtsParser extends CstParser {
    errorlist: ParserError[] = [];

    declare [WtsRule.wts]: ParserMethod<any, any>;
    declare [WtsRule.block]: ParserMethod<any, any>;

    constructor() {
        super(Object.values(WtsTokens), {
            recoveryEnabled: true,
            errorMessageProvider: {
                buildEarlyExitMessage: (options): string => {
                    console.error('EarlyExit');
                    console.log(options);
                    return '';
                },
                buildMismatchTokenMessage: (options): string => {
                    console.error('MismatchToken');
                    console.log(options);
                    this.errorlist.push(new ParserError(ParserErrorType.MismatchToken, options.actual));
                    return '';
                },
                buildNoViableAltMessage: (options): string => {
                    console.error('NoViableAlt');
                    console.log(options);
                    return '';
                },
                buildNotAllInputParsedMessage: (options): string => {
                    console.error('NotAllInputParsed');
                    console.log(options);
                    return '';
                },
            },
        });

        const $ = this;

        $.RULE(WtsRule.wts, () => $.MANY(() => $.SUBRULE($[WtsRule.block])));

        $.RULE(WtsRule.block, () => {
            $.CONSUME(WtsTokens[WtsRule.string]);
            $.CONSUME(WtsTokens.index);
            $.MANY(() => $.OR([
                {ALT: () => $.CONSUME(WtsTokens.comment)},
            ]));
            $.CONSUME(WtsTokens.lparen);
            $.CONSUME(WtsTokens.text);
            $.CONSUME(WtsTokens.rparen);
        });

        this.performSelfAnalysis();
    }
}
