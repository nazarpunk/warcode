import {Lexer} from 'chevrotain';
import JassTokens from "./jass-tokens";

const lexer = new Lexer(Object.values(JassTokens));
for (const error of lexer.lexerDefinitionErrors) console.error(error);

export default lexer;

