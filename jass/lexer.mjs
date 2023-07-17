import {createToken, Lexer} from 'chevrotain';

/** @type {Object.<string , import('chevrotain').TokenType>} */
export const JassTokenMap = {
    whitespace: createToken({
        name: 'whitespace',
        pattern: /[^\S\r\n]+/,
        line_breaks: false,
        group: Lexer.SKIPPED,
    }),
    linebreak: createToken({
        name: 'linebreak',
        pattern: /\n|\r\n/,
        label: "\\n",
        line_breaks: true,
    }),
    linecomment: createToken({
        name: 'linecomment',
        pattern: /\/\/[^\r\n]*/,
        label: "\\\\",
        line_breaks: false,
    }),
    comma: createToken({
        name: 'comma',
        pattern: /,/,
        start_chars_hint: [","],
        label: ",",
        line_breaks: false,
    }),
    type: createToken({
        name: 'type',
        pattern: /type/,
        start_chars_hint: ["t"],
        line_breaks: false,
    }),
    extends: createToken({
        name: 'extends',
        pattern: /extends/,
        start_chars_hint: ["e"],
        line_breaks: false,
    }),
    constant: createToken({
        name: 'constant',
        pattern: /constant/,
        start_chars_hint: ["c"],
        line_breaks: false,
    }),
    native: createToken({
        name: 'native',
        pattern: /native/,
        start_chars_hint: ["n"],
        line_breaks: false,
    }),
    takes: createToken({
        name: 'takes',
        pattern: /takes/,
        start_chars_hint: ["t"],
        line_breaks: false,
    }),
    nothing: createToken({
        name: 'nothing',
        pattern: /nothing/,
        start_chars_hint: ["n"],
        line_breaks: false,
    }),
    returns: createToken({
        name: 'returns',
        pattern: /returns/,
        start_chars_hint: ["r"],
        line_breaks: false,
    }),
    identifier: createToken({
        name: 'identifier',
        pattern: /[a-zA-Z][a-zA-Z0-9_]*/,
    }),
}

/** @type {import('chevrotain').TokenType[]} */
export const JassTokenList = [JassTokenMap.whitespace, JassTokenMap.linebreak, JassTokenMap.linecomment, JassTokenMap.comma, JassTokenMap.type, JassTokenMap.extends, JassTokenMap.constant, JassTokenMap.native, JassTokenMap.takes, JassTokenMap.nothing, JassTokenMap.returns, JassTokenMap.identifier];

export const JassLexer = new Lexer(JassTokenList);
for (const error of JassLexer.lexerDefinitionErrors) console.error(error);