// noinspection DuplicatedCode

import {CstParser, EOF, ParserMethod} from "chevrotain";
import JassRule from "./jass-rule";
import JassTokens from "./jass-tokens";
import JassTokensList from "./jass-tokens-list";
import {IParserConfig} from "@chevrotain/types";

export default class JassParser extends CstParser {
    declare [JassRule.jass]: ParserMethod<any, any>;
    declare [JassRule.type_declare]: ParserMethod<any, any>;
    declare [JassRule.native_declare]: ParserMethod<any, any>;
    declare [JassRule.function_declare]: ParserMethod<any, any>;
    declare [JassRule.globals_declare]: ParserMethod<any, any>;
    declare [JassRule.end]: ParserMethod<any, any>;
    declare [JassRule.function_args]: ParserMethod<any, any>;
    declare [JassRule.function_returns]: ParserMethod<any, any>;
    declare [JassRule.function_locals]: ParserMethod<any, any>;
    declare [JassRule.statement]: ParserMethod<any, any>;
    declare [JassRule.typedname]: ParserMethod<any, any>;
    declare [JassRule.expression]: ParserMethod<any, any>;
    declare [JassRule.variable_declare]: ParserMethod<any, any>;
    declare [JassRule.elseif_statement]: ParserMethod<any, any>;
    declare [JassRule.else_statement]: ParserMethod<any, any>;
    declare [JassRule.function_call]: ParserMethod<any, any>;
    declare [JassRule.arrayaccess]: ParserMethod<any, any>;
    declare [JassRule.addition]: ParserMethod<any, any>;
    declare [JassRule.multiplication]: ParserMethod<any, any>;
    declare [JassRule.primary]: ParserMethod<any, any>;
    declare [JassRule.call_statement]: ParserMethod<any, any>;
    declare [JassRule.set_statement]: ParserMethod<any, any>;
    declare [JassRule.loop_statement]: ParserMethod<any, any>;
    declare [JassRule.exitwhen_statement]: ParserMethod<any, any>;
    declare [JassRule.if_statement]: ParserMethod<any, any>;
    declare [JassRule.return_statement]: ParserMethod<any, any>;

    constructor(config?: IParserConfig) {
        super(JassTokensList, config);

        const $ = this;

        //region jass
        $.RULE(JassRule.jass, () => $.MANY(() => $.OR([
            {ALT: () => $.SUBRULE($[JassRule.type_declare])},
            {ALT: () => $.SUBRULE($[JassRule.native_declare])},
            {ALT: () => $.SUBRULE($[JassRule.function_declare])},
            {ALT: () => $.SUBRULE($[JassRule.globals_declare])},
            {ALT: () => $.CONSUME(JassTokens[JassRule.linebreak])},
        ])));
        //endregion

        //region type
        $.RULE(JassRule.type_declare, () => {
            $.CONSUME(JassTokens[JassRule.type]);
            $.CONSUME(JassTokens[JassRule.identifier]);
            $.CONSUME(JassTokens[JassRule.extends]);
            $.CONSUME2(JassTokens[JassRule.identifier]);
            $.SUBRULE($[JassRule.end]);
        });
        //endregion

        //region native
        $.RULE(JassRule.native_declare, () => {
            $.OPTION(() => $.CONSUME(JassTokens[JassRule.constant]));
            $.CONSUME(JassTokens[JassRule.native]);
            $.CONSUME2(JassTokens[JassRule.identifier]);
            $.CONSUME3(JassTokens[JassRule.takes]);
            $.SUBRULE($[JassRule.function_args]);
            $.CONSUME4(JassTokens[JassRule.returns]);
            $.SUBRULE($[JassRule.function_returns]);
            $.SUBRULE($[JassRule.end]);
        });
        //endregion

        //region function
        $.RULE(JassRule.function_declare, () => {
            $.OPTION(() => $.CONSUME(JassTokens[JassRule.constant]));
            $.CONSUME(JassTokens[JassRule.function]);
            $.CONSUME2(JassTokens[JassRule.identifier]);
            $.CONSUME3(JassTokens[JassRule.takes]);
            $.SUBRULE($[JassRule.function_args]);
            $.CONSUME4(JassTokens[JassRule.returns]);
            $.SUBRULE($[JassRule.function_returns]);
            $.SUBRULE($[JassRule.end]);
            $.MANY1(() => $.SUBRULE($[JassRule.function_locals]));
            $.MANY2(() => $.SUBRULE($[JassRule.statement]));
            $.CONSUME(JassTokens[JassRule.endfunction]);
            $.SUBRULE2($[JassRule.end]);
        });
        //endregion

        //region variable
        $.RULE(JassRule.variable_declare, () => {
            $.OPTION(() => $.OR([
                {ALT: () => $.CONSUME(JassTokens[JassRule.constant])},
                {ALT: () => $.CONSUME(JassTokens[JassRule.local])},
            ]));
            $.SUBRULE($[JassRule.typedname]);
            $.OPTION2(() => {
                $.CONSUME(JassTokens[JassRule.assign]);
                $.SUBRULE($[JassRule.expression]);
            });
            $.SUBRULE($[JassRule.end]);
        });
        //endregion

        //region globals
        $.RULE(JassRule.globals_declare, () => {
            $.CONSUME(JassTokens[JassRule.globals]);
            $.SUBRULE($[JassRule.end]);
            $.MANY(() => $.OR([
                {ALT: () => $.SUBRULE($[JassRule.variable_declare])},
                {ALT: () => $.CONSUME(JassTokens[JassRule.linebreak])},
            ]));
            $.CONSUME3(JassTokens[JassRule.endglobals]);
            $.SUBRULE2($[JassRule.end]);
        });
        //endregion

        //region if
        $.RULE(JassRule.if_statement, () => {
            $.CONSUME(JassTokens[JassRule.if]);
            $.SUBRULE($[JassRule.expression]);
            $.CONSUME(JassTokens[JassRule.then]);
            $.SUBRULE($[JassRule.end]);
            $.MANY(() => $.SUBRULE($[JassRule.statement]));
            $.MANY2(() => $.SUBRULE($[JassRule.elseif_statement]));
            $.OPTION(() => $.SUBRULE($[JassRule.else_statement]));
            $.CONSUME(JassTokens[JassRule.endif]);
            $.SUBRULE2($[JassRule.end]);
        });
        //endregion

        //region elseif
        $.RULE(JassRule.elseif_statement, () => {
            $.CONSUME(JassTokens[JassRule.elseif]);
            $.SUBRULE($[JassRule.expression]);
            $.CONSUME(JassTokens[JassRule.then]);
            $.SUBRULE($[JassRule.end]);
            $.MANY(() => $.SUBRULE($[JassRule.statement]));
        });
        //endregion

        //region else
        $.RULE(JassRule.else_statement, () => {
            $.CONSUME(JassTokens[JassRule.else]);
            $.SUBRULE($[JassRule.end]);
            $.MANY(() => $.SUBRULE($[JassRule.statement]));
        });
        //endregion

        //region call
        $.RULE(JassRule.call_statement, () => {
            $.OPTION(() => $.CONSUME(JassTokens[JassRule.debug]));
            $.CONSUME(JassTokens[JassRule.call]);
            $.SUBRULE($[JassRule.function_call]);
            $.SUBRULE($[JassRule.end]);
        });
        //endregion

        //region return
        $.RULE(JassRule.return_statement, () => {
            $.CONSUME(JassTokens[JassRule.return]);
            $.OPTION(() => $.SUBRULE($[JassRule.expression]));
            $.SUBRULE($[JassRule.end]);
        });
        //endregion

        //region set
        $.RULE(JassRule.set_statement, () => {
            $.CONSUME(JassTokens[JassRule.set]);
            $.CONSUME(JassTokens[JassRule.identifier]);
            $.OPTION(() => $.SUBRULE($[JassRule.arrayaccess]));
            $.CONSUME(JassTokens[JassRule.assign]);
            $.SUBRULE($[JassRule.expression]);
            $.SUBRULE($[JassRule.end]);
        });
        //endregion

        //region loop
        $.RULE(JassRule.loop_statement, () => {
            $.CONSUME(JassTokens[JassRule.loop]);
            $.SUBRULE($[JassRule.end]);
            $.MANY(() => $.SUBRULE($[JassRule.statement]));
            $.CONSUME(JassTokens[JassRule.endloop]);
            $.SUBRULE2($[JassRule.end]);
        });
        //endregion

        //region exitwhen
        $.RULE(JassRule.exitwhen_statement, () => {
            $.CONSUME(JassTokens[JassRule.exitwhen]);
            $.SUBRULE($[JassRule.expression]);
            $.SUBRULE($[JassRule.end]);
        });
        //endregion

        //region function_args
        $.RULE(JassRule.function_args, () => {
            $.OR([
                {ALT: () => $.CONSUME(JassTokens[JassRule.nothing])},
                {
                    ALT: () => {
                        $.AT_LEAST_ONE_SEP({
                            SEP: JassTokens[JassRule.comma],
                            DEF: () => $.SUBRULE($[JassRule.typedname])
                        });
                    }
                },
            ]);
        });
        //endregion

        //region typedname
        $.RULE(JassRule.typedname, () => {
            $.CONSUME(JassTokens[JassRule.identifier]);
            $.OPTION2(() => $.CONSUME(JassTokens[JassRule.array]));
            $.CONSUME2(JassTokens[JassRule.identifier]);
        });
        //endregion

        $.RULE(JassRule.function_returns, () => {
            $.OR([
                {ALT: () => $.CONSUME(JassTokens[JassRule.nothing])},
                {ALT: () => $.CONSUME(JassTokens[JassRule.identifier])},
            ]);
        });

        $.RULE(JassRule.function_locals, () => {
            $.OR([
                {ALT: () => $.CONSUME(JassTokens[JassRule.linebreak])},
                {ALT: () => $.SUBRULE($[JassRule.variable_declare])},
            ]);
        });

        //region expression
        $.RULE(JassRule.expression, () => {
            $.OR([
                {
                    ALT: () => {
                        $.SUBRULE($[JassRule.addition]);
                        $.MANY(() => {
                            $.OR2([
                                {ALT: () => $.CONSUME(JassTokens[JassRule.and])},
                                {ALT: () => $.CONSUME(JassTokens[JassRule.or])},
                                {ALT: () => $.CONSUME(JassTokens[JassRule.equals])},
                                {ALT: () => $.CONSUME(JassTokens[JassRule.notequals])},
                                {ALT: () => $.CONSUME(JassTokens[JassRule.less])},
                                {ALT: () => $.CONSUME(JassTokens[JassRule.lessorequal])},
                                {ALT: () => $.CONSUME(JassTokens[JassRule.great])},
                                {ALT: () => $.CONSUME(JassTokens[JassRule.greatorequal])},
                            ]);
                            $.SUBRULE2($[JassRule.addition]);
                        });
                    }
                },
            ]);
        });
        //endregion

        $.RULE(JassRule.addition, () => {
            $.OR([
                {
                    ALT: () => {
                        $.SUBRULE($[JassRule.multiplication]);
                        $.MANY(() => {
                            $.OR2([
                                {ALT: () => $.CONSUME2(JassTokens[JassRule.add])},
                                {ALT: () => $.CONSUME3(JassTokens[JassRule.sub])},
                            ]);
                            $.SUBRULE2($[JassRule.multiplication]);
                        });
                    }
                },
            ]);
        });

        $.RULE(JassRule.multiplication, () => {
            $.OR([
                {
                    ALT: () => {
                        $.SUBRULE($[JassRule.primary]);
                        $.MANY(() => {
                            $.OR2([
                                {ALT: () => $.CONSUME2(JassTokens[JassRule.mult])},
                                {ALT: () => $.CONSUME3(JassTokens[JassRule.div])},
                            ]);
                            $.SUBRULE2($[JassRule.primary]);
                        });
                    }
                },
            ]);
        });

        //region primary
        $.RULE(JassRule.primary, () => {
            $.OR([
                {
                    ALT: () => {
                        $.OPTION(() => $.CONSUME(JassTokens[JassRule.sub]));
                        $.CONSUME(JassTokens[JassRule.integer]);
                    }
                },
                {
                    ALT: () => {
                        $.CONSUME(JassTokens[JassRule.not]);
                        $.SUBRULE($[JassRule.primary]);
                    }
                },
                {
                    ALT: () => {
                        $.OPTION5(() => $.CONSUME3(JassTokens[JassRule.sub]));
                        $.SUBRULE($[JassRule.function_call]);
                    }
                },
                {
                    ALT: () => {
                        $.OPTION6(() => $.CONSUME6(JassTokens[JassRule.sub]));
                        $.CONSUME(JassTokens[JassRule.lparen]);
                        $.SUBRULE2($[JassRule.expression]);
                        $.CONSUME(JassTokens[JassRule.rparen]);
                    }
                },
                {
                    ALT: () => {
                        $.OPTION3(() => $.CONSUME5(JassTokens[JassRule.sub]));
                        $.CONSUME3(JassTokens[JassRule.identifier]);
                        $.OPTION4(() => $.SUBRULE($[JassRule.arrayaccess]));
                    }
                },
                {
                    ALT: () => {
                        $.CONSUME(JassTokens[JassRule.function]);
                        $.CONSUME4(JassTokens[JassRule.identifier]);
                    }
                },
                {
                    ALT: () => {
                        $.OPTION2(() => $.CONSUME2(JassTokens[JassRule.sub]));
                        $.CONSUME3(JassTokens[JassRule.real]);
                    }
                },
                {
                    ALT: () => $.CONSUME3(JassTokens[JassRule.idliteral])
                },
                {
                    ALT: () => $.CONSUME3(JassTokens[JassRule.stringliteral])
                }
            ]);
        });
        //endregion

        $.RULE(JassRule.arrayaccess, () => {
            $.CONSUME(JassTokens[JassRule.lsquareparen]);
            $.SUBRULE3($[JassRule.expression]);
            $.CONSUME(JassTokens[JassRule.rsquareparen]);
        });

        $.RULE(JassRule.function_call, () => {
            $.CONSUME(JassTokens[JassRule.identifier]);
            $.CONSUME2(JassTokens[JassRule.lparen]);
            $.MANY_SEP({
                SEP: JassTokens[JassRule.comma],
                DEF: () => $.SUBRULE($[JassRule.expression])
            });
            $.CONSUME3(JassTokens[JassRule.rparen]);
        });

        //region statement
        $.RULE(JassRule.statement, () => {
            $.OR4([
                {ALT: () => $.SUBRULE($[JassRule.call_statement])},
                {ALT: () => $.SUBRULE($[JassRule.set_statement])},
                {ALT: () => $.SUBRULE($[JassRule.loop_statement])},
                {ALT: () => $.SUBRULE($[JassRule.exitwhen_statement])},
                {ALT: () => $.SUBRULE($[JassRule.if_statement])},
                {ALT: () => $.SUBRULE($[JassRule.return_statement])},
                {ALT: () => $.CONSUME(JassTokens[JassRule.linebreak])},
            ]);
        });
        //endregion

        //region end
        $.RULE(JassRule.end, () => {
            $.OR([
                {ALT: () => $.CONSUME(JassTokens[JassRule.linebreak])},
                {ALT: () => $.CONSUME2(EOF)}
            ]);
        });
        //endregion

        this.performSelfAnalysis();
    }
}
