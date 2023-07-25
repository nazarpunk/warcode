import {Lexer} from 'chevrotain';
import JassTokenList from "./jass-token-list";

const lexer = new Lexer(JassTokenList);
for (const error of lexer.lexerDefinitionErrors) console.error(error);

export default lexer;

