import {Lexer} from "chevrotain";
import WtsTokens from "./wts-tokens";

const lexer = new Lexer(Object.values(WtsTokens));
for (const error of lexer.lexerDefinitionErrors) console.error(error);

export default lexer;


