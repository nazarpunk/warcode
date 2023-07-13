import {CstParser} from "chevrotain";
import {JassTokenList, JassTokenMap} from "./lexer";
import {ParserMethod} from "@chevrotain/types";
/*

import {
    Diagnostic,
    DiagnosticRelatedInformation,
    DiagnosticSeverity,
    Location,
    Position,
    Range,
    TextDocument
} from "vscode";

 */

export class JassParser extends CstParser {

    declare jass: ParserMethod<any, any>;
    declare typedecl: ParserMethod<any, any>;
    declare nativedecl: ParserMethod<any, any>;
    declare statement: ParserMethod<any, any>;
    declare funcarg: ParserMethod<any, any>;
    declare funcarglist: ParserMethod<any, any>;
    declare funcreturntype: ParserMethod<any, any>;

    /*
    diagnostic?: Diagnostic[];
    document?: TextDocument;

     */

    constructor() {
        super(JassTokenList, {
            recoveryEnabled: true,
            errorMessageProvider: {
                buildMismatchTokenMessage: options => {
                    /*
                    if (this.diagnostic && this.document) {
                        console.log(options.actual);
                        this.diagnostic.push({
                            message: 'cannot assign twice to immutable variable `x`',
                            range: new Range(new Position(0, 0), new Position(3, 10)),
                            severity: DiagnosticSeverity.Error,
                            source: '',
                            relatedInformation: [
                                new DiagnosticRelatedInformation(
                                    new Location(
                                        this.document.uri,
                                        new Range(
                                            new Position(1, 8),
                                            new Position(1, 9)
                                        )
                                    ),
                                    'Its WORKING!!!'
                                )
                            ]
                        });
                    } else {
                        console.error('buildMismatchTokenMessage');
                        console.log(options);
                    }

                     */
                    console.error('buildMismatchTokenMessage');
                    console.log(options);
                    return null;
                },
                buildNotAllInputParsedMessage: options => {
                    console.error('buildNotAllInputParsedMessage');
                    console.log(options);
                    return null;
                },

                buildNoViableAltMessage: options => {
                    console.error('buildNoViableAltMessage');
                    console.log(options);
                    return null;
                },

                buildEarlyExitMessage: options => {
                    console.error('buildEarlyExitMessag');
                    console.log(options);
                    return null;
                },
            },
        })

        const $ = this;

        $.RULE('jass', () => {
            $.MANY(() => {
                $.SUBRULE($.statement);
            });
        });

        $.RULE("statement", () => {
            $.OR([
                {ALT: () => $.SUBRULE($.typedecl)},
                {ALT: () => $.SUBRULE($.nativedecl)},
            ]);
        });

        $.RULE('typedecl', () => {
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