import {createToken, Lexer} from "chevrotain";

/** @type {import("chevrotain").TokenType[]} */
export const JassTokenList = [];

/** @type {Object.<string,import("chevrotain").ITokenConfig>} */
export const JassTokenMap = {
    whitespace: {name: '', pattern: /\s+/, group: Lexer.SKIPPED},
    comment: {name: '', pattern: /\/\/.*/, group: Lexer.SKIPPED},
    comma: {name: '', pattern: /,/, label: ','},
    type: {name: '', pattern: /type/},
    extends: {name: '', pattern: /extends/},
    constant: {name: '', pattern: /constant/},
    native: {name: '', pattern: /native/},
    takes: {name: '', pattern: /takes/},
    nothing: {name: '', pattern: /nothing/},
    returns: {name: '', pattern: /returns/},
    identifier: {name: '', pattern: /[a-zA-Z][a-zA-Z0-9_]*/},
}

for (const [k, v] of Object.entries(JassTokenMap)) {
    v.name = k;
    JassTokenMap[k] = createToken(v);
    JassTokenList.push(JassTokenMap[k]);
}

const lexer = new Lexer(JassTokenList);
if (lexer.lexerDefinitionErrors.length > 0) for (const error of lexer.lexerDefinitionErrors) console.error(error);

export function JassLex(text) {
    const result = lexer.tokenize(text);
    if (result.errors.length > 0) for (const error of result.errors) console.error(error);
    return result;
}
