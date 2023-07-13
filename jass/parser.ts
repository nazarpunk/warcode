import {CstParser} from "chevrotain";
import {JassTokenList, JassTokenMap} from "./lexer.ts";

export class JassParser extends CstParser {
    constructor() {
        super(JassTokenList, {
            recoveryEnabled: true,
        })

        const $ = this;

        $.RULE('jass', () => {
            $.MANY(() => {
                $.SUBRULE($.statement);
            });
        });

        $.RULE("statement", () => {
            $.OR([
                {ALT: () => $.SUBRULE($.typedef)},
                {ALT: () => $.SUBRULE($.nativedecl)},
            ]);
        });

        $.RULE('typedef', () => {
            $.CONSUME(JassTokenMap.type);
            $.CONSUME(JassTokenMap.identifier);
            $.CONSUME(JassTokenMap.extends);
            $.CONSUME2(JassTokenMap.identifier);
        });

        $.RULE('funcarg', () => {
            $.CONSUME(JassTokenMap.identifier)
            $.CONSUME2(JassTokenMap.identifier)
        });

        $.RULE('funcarglist', () => {
            $.OR([
                {ALT: () => $.CONSUME(JassTokenMap.nothing)},
                {
                    ALT: () => {
                        $.SUBRULE($.funcarg)
                        $.MANY(() => {
                            $.CONSUME(JassTokenMap.comma)
                            $.SUBRULE2($.funcarg)
                        })
                    }
                },
            ]);
        });

        $.RULE('funcreturntype', () => {
            $.OR([
                {ALT: () => $.CONSUME(JassTokenMap.nothing)},
                {ALT: () => $.CONSUME(JassTokenMap.identifier)},
            ])
        });

        $.RULE('nativedecl', () => {
            $.OPTION(() => $.CONSUME(JassTokenMap.constant));
            $.CONSUME(JassTokenMap.native);
            $.CONSUME2(JassTokenMap.identifier);
            $.CONSUME3(JassTokenMap.takes);
            $.SUBRULE($.funcarglist);
            $.CONSUME4(JassTokenMap.returns);
            $.SUBRULE($.funcreturntype);
        });

        this.performSelfAnalysis();
    }
}