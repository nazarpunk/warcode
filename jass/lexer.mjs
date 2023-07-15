import {createToken, EOF, Lexer} from "chevrotain";

/** @type {import("chevrotain").TokenType[]} */
export const JassTokenList = [];

/** @type {Object.<string , import("chevrotain").ITokenConfig>} */
export const JassTokenMap = {
    whitespace: {
        name: '',
        pattern: /[^\S\r\n]+/,
        line_breaks: false,
        group: Lexer.SKIPPED
    },
    linebreak: {
        name: '',
        pattern: /\n|\r\n/,
        label: '\\n',
        line_breaks: true,
    },
    linecomment: {
        name: '',
        pattern: /\/\/[^\r\n]*/,
        label: '\\\\',
        line_breaks: false,
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
    },
    extends: {
        name: '',
        pattern: /extends/,
        start_chars_hint: ['e'],
        line_breaks: false,
    },
    constant: {
        name: '',
        pattern: /constant/,
        start_chars_hint: ['c'],
        line_breaks: false,
    },
    native: {
        name: '',
        pattern: /native/,
        start_chars_hint: ['n'],
        line_breaks: false,
    },
    takes: {
        name: '',
        pattern: /takes/,
        start_chars_hint: ['t'],
        line_breaks: false,
    },
    nothing: {
        name: '',
        pattern: /nothing/,
        start_chars_hint: ['n'],
        line_breaks: false,
    },
    returns: {
        name: '',
        pattern: /returns/,
        start_chars_hint: ['r'],
        line_breaks: false,
    },
    identifier: {
        name: 'identifier',
        pattern: /[a-zA-Z][a-zA-Z0-9_]*/
    },
}

for (const [k, v] of Object.entries(JassTokenMap)) {
    v.name = k;
// noinspection JSValidateTypes
    JassTokenMap[k] = createToken(v);
    // noinspection JSCheckFunctionSignatures
    JassTokenList.push(JassTokenMap[k]);
}

export const JassLexer = new Lexer(JassTokenList);
if (JassLexer.lexerDefinitionErrors.length > 0) for (const error of JassLexer.lexerDefinitionErrors) console.error(error);
