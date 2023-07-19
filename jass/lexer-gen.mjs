import {Lexer} from "chevrotain";
import fs from "fs";

/** @type {import('chevrotain').ITokenConfig[]} */
const tokenList = [
    {
        name: 'whitespace',
        pattern: /[^\S\r\n]+/,
        line_breaks: false,
        group: Lexer.SKIPPED
    },
    {
        name: 'comment',
        pattern: /\/\/[^\r\n]*/,
        line_breaks: false,
    },
    // keyword
    {
        name: 'type',
        pattern: /\btype\b/,
        start_chars_hint: ['t'],
        line_breaks: false,
    },
    {
        name: 'globals',
        pattern: /\bglobals\b/,
        start_chars_hint: ['g'],
        line_breaks: false,
    },
    {
        name: 'endglobals',
        pattern: /\bendglobals\b/,
        start_chars_hint: ['e'],
        line_breaks: false,
    },
    {
        name: 'extends',
        pattern: /\bextends\b/,
        start_chars_hint: ['e'],
        line_breaks: false,
    },
    {
        name: 'constant',
        pattern: /\bconstant\b/,
        start_chars_hint: ['c'],
        line_breaks: false,
    },
    {
        name: 'native',
        pattern: /\bnative\b/,
        start_chars_hint: ['n'],
        line_breaks: false,
    },
    {
        name: 'function',
        pattern: /\bfunction\b/,
        start_chars_hint: ['f'],
        line_breaks: false,
    },
    {
        name: 'takes',
        pattern: /\btakes\b/,
        start_chars_hint: ['t'],
        line_breaks: false,
    },
    {
        name: 'nothing',
        pattern: /\bnothing\b/,
        start_chars_hint: ['n'],
        line_breaks: false,
    },
    {
        name: 'returns',
        pattern: /\breturns\b/,
        start_chars_hint: ['r'],
        line_breaks: false,
    },
    {
        name: 'local',
        pattern: /\blocal\b/,
        start_chars_hint: ['l'],
        line_breaks: false,
    },
    {
        name: 'and',
        pattern: /\band\b/,
        start_chars_hint: ['a'],
        line_breaks: false,
    },
    {
        name: 'or',
        pattern: /\bor\b/,
        start_chars_hint: ['o'],
        line_breaks: false,
    },
    {
        name: 'call',
        pattern: /\bcall\b/,
        start_chars_hint: ['c'],
        line_breaks: false,
    },
    {
        name: 'not',
        pattern: /\bnot\b/,
        start_chars_hint: ['n'],
        line_breaks: false,
    },
    {
        name: 'set',
        pattern: /\bset\b/,
        start_chars_hint: ['s'],
        line_breaks: false,
    },
    {
        name: 'loop',
        pattern: /\bloop\b/,
        start_chars_hint: ['l'],
        line_breaks: false,
    },
    {
        name: 'then',
        pattern: /\bthen\b/,
        start_chars_hint: ['t'],
        line_breaks: false,
    },
    {
        name: 'exitwhen',
        pattern: /\bexitwhen\b/,
        start_chars_hint: ['e'],
        line_breaks: false,
    },
    {
        name: 'endloop',
        pattern: /\bendloop\b/,
        start_chars_hint: ['e'],
        line_breaks: false,
    },
    {
        name: 'elseif',
        pattern: /\belseif\b/,
        start_chars_hint: ['e'],
        line_breaks: false,
    },
    {
        name: 'else',
        pattern: /\belse\b/,
        start_chars_hint: ['e'],
        line_breaks: false,
    },
    {
        name: 'endif',
        pattern: /\bendif\b/,
        start_chars_hint: ['e'],
        line_breaks: false,
    },
    {
        name: 'endfunction',
        pattern: /\bendfunction\b/,
        start_chars_hint: ['e'],
        line_breaks: false,
    },
    // someone
    {
        name: 'comma',
        pattern: /,/,
        start_chars_hint: [','],
        label: ',',
        line_breaks: false,
    },
    {
        name: 'equalsequals',
        pattern: /==/,
        start_chars_hint: ['='],
        line_breaks: false,
        label: '=='
    },
    {
        name: 'equals',
        pattern: /=/,
        start_chars_hint: ['='],
        line_breaks: false,
        label: '='
    },
    {
        name: 'notequals',
        pattern: /!=/,
        start_chars_hint: ['!'],
        line_breaks: false,
        label: '!='
    },
    {
        name: 'add',
        pattern: /\+/,
        start_chars_hint: ['+'],
        line_breaks: false,
        label: '+'
    },
    {
        name: 'sub',
        pattern: /-/,
        start_chars_hint: ['-'],
        line_breaks: false,
        label: '-'
    },
    {
        name: 'mult',
        pattern: /\*/,
        start_chars_hint: ['*'],
        line_breaks: false,
        label: '*'
    },
    {
        name: 'div',
        pattern: /\//,
        start_chars_hint: ['/'],
        line_breaks: false,
        label: '/'
    },
    {
        name: 'if',
        pattern: /if/,
        start_chars_hint: ['i'],
        line_breaks: false,
    },
    {
        name: 'stringliteral',
        pattern: /".*"/,
        start_chars_hint: ['"'],
        line_breaks: false,
    },
    {
        name: 'lparen',
        pattern: /\(/,
        start_chars_hint: ['('],
        line_breaks: false,
        label: '(',
    },
    {
        name: 'rparen',
        pattern: /\)/,
        start_chars_hint: [')'],
        line_breaks: false,
        label: ')',
    },
    {
        name: 'lsquareparen',
        pattern: /\[/,
        start_chars_hint: ['['],
        line_breaks: false,
        label: '[',
    },
    {
        name: 'rsquareparen',
        pattern: /]/,
        start_chars_hint: [']'],
        line_breaks: false,
        label: ']',
    },
    // no start_chars_hint
    {
        name: 'idliteral',
        pattern: /'.*'/,
        line_breaks: false,
    },
    {
        name: 'integer',
        pattern: /[0-9]+/,
        line_breaks: false,
    },
    {
        name: 'real',
        pattern: /[0-9]+\.[0-9]+/,
        line_breaks: false,
    },
    {
        name: 'linebreak',
        pattern: /\n|\r\n/,
        label: '\\n',
        line_breaks: true,
    },
    {
        name: 'identifier',
        pattern: /[a-zA-Z][a-zA-Z0-9_]*/,
        line_breaks: false,
    },
]

const lexerPath = 'lexer.mjs';
const tab = ' '.repeat(4);

/**
 * @param {string} text
 * @param {string} flag
 */
const write = (text, flag = 'a+') => fs.writeFileSync(lexerPath, text, {flag: flag});

write(`import {createToken, Lexer} from 'chevrotain';

export const JassTokenMap = {
`, 'w+');

const nameList = [];

for (const c of tokenList) {
    nameList.push(c.name);

    write(`${tab}${c.name}: createToken({\n`);
    for (const [k, v] of Object.entries(c)) {
        write(`${tab.repeat(2)}${k}: `);
        switch (k) {
            case 'name':
                write(`'${c.name}'`);
                break;
            case 'pattern':
                write(`${v}`);
                break;
            default:
                write(v === Lexer.SKIPPED ? 'Lexer.SKIPPED' : `${JSON.stringify(v)}`);
        }
        write(`,\n`);
    }

    write(`${tab}}),\n`);
}
write(`}\n`);

write(`
/** @type {import('chevrotain').TokenType[]} */
export const JassTokenList = [${nameList.map(s => `JassTokenMap.${s}`).join(', ')}];
`);

write(`
export const JassLexer = new Lexer(JassTokenList);
for (const error of JassLexer.lexerDefinitionErrors) console.error(error);`)