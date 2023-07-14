import {createToken, ITokenConfig, Lexer, TokenType} from "chevrotain";

export const JassTokenList: TokenType[] = [];

const identifier = createToken({name: 'identifier', pattern: /[a-zA-Z][a-zA-Z0-9_]*/});

export const JassTokenMap: { [key: string]: ITokenConfig } = {
    whitespace: {
        name: '',
        pattern: /\s+/,
        //line_breaks: false,
        group: Lexer.SKIPPED
    },
    comment: {
        name: '',
        pattern: /\/\/.*/,
        line_breaks: false,
        group: Lexer.SKIPPED
    },
    comma: {
        name: '',
        pattern: /,/,
        start_chars_hint: [','],
        label: ',',
        line_breaks: false,
    },
    type: {
        name: '',
        pattern: /type/,
        start_chars_hint: ['t'],
        line_breaks: false,
        longer_alt: identifier
    },
    extends: {
        name: '',
        pattern: /extends/,
        start_chars_hint: ['e'],
        line_breaks: false,
        longer_alt: identifier
    },
    constant: {
        name: '',
        pattern: /constant/,
        start_chars_hint: ['c'],
        line_breaks: false,
        longer_alt: identifier
    },
    native: {
        name: '',
        pattern: /native/,
        start_chars_hint: ['n'],
        line_breaks: false,
        longer_alt: identifier
    },
    takes: {
        name: '',
        pattern: /takes/,
        start_chars_hint: ['t'],
        line_breaks: false,
        longer_alt: identifier
    },
    nothing: {
        name: '',
        pattern: /nothing/,
        start_chars_hint: ['n'],
        line_breaks: false,
        longer_alt: identifier
    },
    returns: {
        name: '',
        pattern: /returns/,
        start_chars_hint: ['r'],
        line_breaks: false,
        longer_alt: identifier
    },
    identifier: identifier,
}

for (const [k, v] of Object.entries(JassTokenMap)) {
    v.name = k;
    if (k != identifier.name) JassTokenMap[k] = createToken(v);
    JassTokenList.push(JassTokenMap[k]);
}

export const JassLexer = new Lexer(JassTokenList);
if (JassLexer.lexerDefinitionErrors.length > 0) for (const error of JassLexer.lexerDefinitionErrors) console.error(error);
