import {createToken, ITokenConfig, Lexer, TokenType} from "chevrotain";

export const JassTokenList: TokenType[] = [];

const identifier = createToken({name: 'identifier', pattern: /[a-zA-Z][a-zA-Z0-9_]*/});

export const JassTokenMap: { [key: string]: ITokenConfig } = {
    whitespace: {name: '', pattern: /\s+/, group: Lexer.SKIPPED},
    comment: {name: '', pattern: /\/\/.*/, group: Lexer.SKIPPED},
    comma: {name: '', pattern: /,/, label: ','},
    type: {name: '', pattern: /type/, longer_alt: identifier},
    extends: {name: '', pattern: /extends/, longer_alt: identifier},
    constant: {name: '', pattern: /constant/, longer_alt: identifier},
    native: {name: '', pattern: /native/, longer_alt: identifier},
    takes: {name: '', pattern: /takes/, longer_alt: identifier},
    nothing: {name: '', pattern: /nothing/, longer_alt: identifier},
    returns: {name: '', pattern: /returns/, longer_alt: identifier},
    identifier: identifier,
}

for (const [k, v] of Object.entries(JassTokenMap)) {
    v.name = k;
    if (k != identifier.name) JassTokenMap[k] = createToken(v);
    JassTokenList.push(JassTokenMap[k]);
}

const lexer = new Lexer(JassTokenList);
if (lexer.lexerDefinitionErrors.length > 0) for (const error of lexer.lexerDefinitionErrors) console.error(error);

export function JassLex(text) {
    const result = lexer.tokenize(text);
    if (result.errors.length > 0) for (const error of result.errors) console.error(error);
    return result;
}
