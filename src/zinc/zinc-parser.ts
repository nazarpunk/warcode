// noinspection DuplicatedCode

import {CstParser, ParserMethod} from "chevrotain";
import ZincRule from "./zinc-rule";
import ZincTokens from "./zinc-tokens";
import ZincTokensList from "./zinc-tokens-list";
import {IParserConfig} from "@chevrotain/types";

export default class ZincParser extends CstParser {
    declare [ZincRule.zinc]: ParserMethod<any, any>;
    declare [ZincRule.function_declare]: ParserMethod<any, any>;
    declare [ZincRule.function_args]: ParserMethod<any, any>;
    declare [ZincRule.function_returns]: ParserMethod<any, any>;
    declare [ZincRule.function_locals]: ParserMethod<any, any>;
    declare [ZincRule.statement]: ParserMethod<any, any>;
    declare [ZincRule.typedname]: ParserMethod<any, any>;
    declare [ZincRule.expression]: ParserMethod<any, any>;
    declare [ZincRule.variable_declare]: ParserMethod<any, any>;
    declare [ZincRule.elseif_statement]: ParserMethod<any, any>;
    declare [ZincRule.else_statement]: ParserMethod<any, any>;
    declare [ZincRule.function_call]: ParserMethod<any, any>;
    declare [ZincRule.arrayaccess]: ParserMethod<any, any>;
    declare [ZincRule.addition]: ParserMethod<any, any>;
    declare [ZincRule.multiplication]: ParserMethod<any, any>;
    declare [ZincRule.primary]: ParserMethod<any, any>;
    declare [ZincRule.call_statement]: ParserMethod<any, any>;
    declare [ZincRule.set_statement]: ParserMethod<any, any>;
    declare [ZincRule.loop_statement]: ParserMethod<any, any>;
    declare [ZincRule.exitwhen_statement]: ParserMethod<any, any>;
    declare [ZincRule.if_statement]: ParserMethod<any, any>;
    declare [ZincRule.return_statement]: ParserMethod<any, any>;

    constructor(config?: IParserConfig) {
        super(ZincTokensList, config);

        const $ = this;

        //region jass
        $.RULE(ZincRule.zinc, () => $.MANY(() => $.SUBRULE($[ZincRule.function_declare])));
        //endregion

        //region function
        $.RULE(ZincRule.function_declare, () => {
            $.OPTION(() => $.CONSUME(ZincTokens[ZincRule.constant]));
            $.CONSUME(ZincTokens[ZincRule.function]);
            $.CONSUME2(ZincTokens[ZincRule.identifier]);
            $.CONSUME3(ZincTokens[ZincRule.takes]);
            $.SUBRULE($[ZincRule.function_args]);
            $.CONSUME4(ZincTokens[ZincRule.returns]);
            $.SUBRULE($[ZincRule.function_returns]);
            $.MANY1(() => $.SUBRULE($[ZincRule.function_locals]));
            $.MANY2(() => $.SUBRULE($[ZincRule.statement]));
            $.CONSUME(ZincTokens[ZincRule.endfunction]);
        });
        //endregion

        //region variable
        $.RULE(ZincRule.variable_declare, () => {
            $.OPTION(() => $.OR([
                {ALT: () => $.CONSUME(ZincTokens[ZincRule.constant])},
                {ALT: () => $.CONSUME(ZincTokens[ZincRule.local])},
            ]));
            $.SUBRULE($[ZincRule.typedname]);
            $.OPTION2(() => {
                $.CONSUME(ZincTokens[ZincRule.assign]);
                $.SUBRULE($[ZincRule.expression]);
            });
        });
        //endregion

        //region if
        $.RULE(ZincRule.if_statement, () => {
            $.CONSUME(ZincTokens[ZincRule.if]);
            $.SUBRULE($[ZincRule.expression]);
            $.CONSUME(ZincTokens[ZincRule.then]);
            $.MANY(() => $.SUBRULE($[ZincRule.statement]));
            $.MANY2(() => $.SUBRULE($[ZincRule.elseif_statement]));
            $.OPTION(() => $.SUBRULE($[ZincRule.else_statement]));
            $.CONSUME(ZincTokens[ZincRule.endif]);
        });
        //endregion

        //region elseif
        $.RULE(ZincRule.elseif_statement, () => {
            $.CONSUME(ZincTokens[ZincRule.elseif]);
            $.SUBRULE($[ZincRule.expression]);
            $.CONSUME(ZincTokens[ZincRule.then]);
            $.MANY(() => $.SUBRULE($[ZincRule.statement]));
        });
        //endregion

        //region else
        $.RULE(ZincRule.else_statement, () => {
            $.CONSUME(ZincTokens[ZincRule.else]);
            $.MANY(() => $.SUBRULE($[ZincRule.statement]));
        });
        //endregion

        //region call
        $.RULE(ZincRule.call_statement, () => {
            $.OPTION(() => $.CONSUME(ZincTokens[ZincRule.debug]));
            $.CONSUME(ZincTokens[ZincRule.call]);
            $.SUBRULE($[ZincRule.function_call]);
        });
        //endregion

        //region return
        $.RULE(ZincRule.return_statement, () => {
            $.CONSUME(ZincTokens[ZincRule.return]);
            $.OPTION(() => $.SUBRULE($[ZincRule.expression]));
        });
        //endregion

        //region set
        $.RULE(ZincRule.set_statement, () => {
            $.CONSUME(ZincTokens[ZincRule.set]);
            $.CONSUME(ZincTokens[ZincRule.identifier]);
            $.OPTION(() => $.SUBRULE($[ZincRule.arrayaccess]));
            $.CONSUME(ZincTokens[ZincRule.assign]);
            $.SUBRULE($[ZincRule.expression]);
        });
        //endregion

        //region loop
        $.RULE(ZincRule.loop_statement, () => {
            $.CONSUME(ZincTokens[ZincRule.loop]);
            $.MANY(() => $.SUBRULE($[ZincRule.statement]));
            $.CONSUME(ZincTokens[ZincRule.endloop]);
        });
        //endregion

        //region exitwhen
        $.RULE(ZincRule.exitwhen_statement, () => {
            $.CONSUME(ZincTokens[ZincRule.exitwhen]);
            $.SUBRULE($[ZincRule.expression]);
        });
        //endregion

        //region function_args
        $.RULE(ZincRule.function_args, () => {
            $.OR([
                {ALT: () => $.CONSUME(ZincTokens[ZincRule.nothing])},
                {
                    ALT: () => {
                        $.AT_LEAST_ONE_SEP({
                            SEP: ZincTokens[ZincRule.comma],
                            DEF: () => $.SUBRULE($[ZincRule.typedname])
                        });
                    }
                },
            ]);
        });
        //endregion

        //region typedname
        $.RULE(ZincRule.typedname, () => {
            $.CONSUME(ZincTokens[ZincRule.identifier]);
            $.OPTION2(() => $.CONSUME(ZincTokens[ZincRule.array]));
            $.CONSUME2(ZincTokens[ZincRule.identifier]);
        });
        //endregion

        $.RULE(ZincRule.function_returns, () => {
            $.OR([
                {ALT: () => $.CONSUME(ZincTokens[ZincRule.nothing])},
                {ALT: () => $.CONSUME(ZincTokens[ZincRule.identifier])},
            ]);
        });

        $.RULE(ZincRule.function_locals, () => {
            $.OR([
                {ALT: () => $.SUBRULE($[ZincRule.variable_declare])},
            ]);
        });

        //region expression
        $.RULE(ZincRule.expression, () => {
            $.OR([
                {
                    ALT: () => {
                        $.SUBRULE($[ZincRule.addition]);
                        $.MANY(() => {
                            $.OR2([
                                {ALT: () => $.CONSUME(ZincTokens[ZincRule.and])},
                                {ALT: () => $.CONSUME(ZincTokens[ZincRule.or])},
                                {ALT: () => $.CONSUME(ZincTokens[ZincRule.equals])},
                                {ALT: () => $.CONSUME(ZincTokens[ZincRule.notequals])},
                                {ALT: () => $.CONSUME(ZincTokens[ZincRule.less])},
                                {ALT: () => $.CONSUME(ZincTokens[ZincRule.lessorequal])},
                                {ALT: () => $.CONSUME(ZincTokens[ZincRule.great])},
                                {ALT: () => $.CONSUME(ZincTokens[ZincRule.greatorequal])},
                            ]);
                            $.SUBRULE2($[ZincRule.addition]);
                        });
                    }
                },
            ]);
        });
        //endregion

        $.RULE(ZincRule.addition, () => {
            $.OR([
                {
                    ALT: () => {
                        $.SUBRULE($[ZincRule.multiplication]);
                        $.MANY(() => {
                            $.OR2([
                                {ALT: () => $.CONSUME2(ZincTokens[ZincRule.add])},
                                {ALT: () => $.CONSUME3(ZincTokens[ZincRule.sub])},
                            ]);
                            $.SUBRULE2($[ZincRule.multiplication]);
                        });
                    }
                },
            ]);
        });

        $.RULE(ZincRule.multiplication, () => {
            $.OR([
                {
                    ALT: () => {
                        $.SUBRULE($[ZincRule.primary]);
                        $.MANY(() => {
                            $.OR2([
                                {ALT: () => $.CONSUME2(ZincTokens[ZincRule.mult])},
                                {ALT: () => $.CONSUME3(ZincTokens[ZincRule.div])},
                            ]);
                            $.SUBRULE2($[ZincRule.primary]);
                        });
                    }
                },
            ]);
        });

        //region primary
        $.RULE(ZincRule.primary, () => {
            $.OR([
                {
                    ALT: () => {
                        $.OPTION(() => $.CONSUME(ZincTokens[ZincRule.sub]));
                        $.CONSUME(ZincTokens[ZincRule.integer]);
                    }
                },
                {
                    ALT: () => {
                        $.CONSUME(ZincTokens[ZincRule.not]);
                        $.SUBRULE($[ZincRule.primary]);
                    }
                },
                {
                    ALT: () => {
                        $.OPTION5(() => $.CONSUME3(ZincTokens[ZincRule.sub]));
                        $.SUBRULE($[ZincRule.function_call]);
                    }
                },
                {
                    ALT: () => {
                        $.OPTION6(() => $.CONSUME6(ZincTokens[ZincRule.sub]));
                        $.CONSUME(ZincTokens[ZincRule.lparen]);
                        $.SUBRULE2($[ZincRule.expression]);
                        $.CONSUME(ZincTokens[ZincRule.rparen]);
                    }
                },
                {
                    ALT: () => {
                        $.OPTION3(() => $.CONSUME5(ZincTokens[ZincRule.sub]));
                        $.CONSUME3(ZincTokens[ZincRule.identifier]);
                        $.OPTION4(() => $.SUBRULE($[ZincRule.arrayaccess]));
                    }
                },
                {
                    ALT: () => {
                        $.CONSUME(ZincTokens[ZincRule.function]);
                        $.CONSUME4(ZincTokens[ZincRule.identifier]);
                    }
                },
                {
                    ALT: () => {
                        $.OPTION2(() => $.CONSUME2(ZincTokens[ZincRule.sub]));
                        $.CONSUME3(ZincTokens[ZincRule.real]);
                    }
                },
                {
                    ALT: () => $.CONSUME3(ZincTokens[ZincRule.idliteral])
                },
                {
                    ALT: () => $.CONSUME3(ZincTokens[ZincRule.stringliteral])
                }
            ]);
        });
        //endregion

        $.RULE(ZincRule.arrayaccess, () => {
            $.CONSUME(ZincTokens[ZincRule.lsquareparen]);
            $.SUBRULE3($[ZincRule.expression]);
            $.CONSUME(ZincTokens[ZincRule.rsquareparen]);
        });

        $.RULE(ZincRule.function_call, () => {
            $.CONSUME(ZincTokens[ZincRule.identifier]);
            $.CONSUME2(ZincTokens[ZincRule.lparen]);
            $.MANY_SEP({
                SEP: ZincTokens[ZincRule.comma],
                DEF: () => $.SUBRULE($[ZincRule.expression])
            });
            $.CONSUME3(ZincTokens[ZincRule.rparen]);
        });

        //region statement
        $.RULE(ZincRule.statement, () => {
            $.OR4([
                {ALT: () => $.SUBRULE($[ZincRule.call_statement])},
                {ALT: () => $.SUBRULE($[ZincRule.set_statement])},
                {ALT: () => $.SUBRULE($[ZincRule.loop_statement])},
                {ALT: () => $.SUBRULE($[ZincRule.exitwhen_statement])},
                {ALT: () => $.SUBRULE($[ZincRule.if_statement])},
                {ALT: () => $.SUBRULE($[ZincRule.return_statement])},
            ]);
        });
        //endregion

        this.performSelfAnalysis();
    }
}
