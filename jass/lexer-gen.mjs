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
        name: 'linebreak',
        pattern: /\n|\r\n/,
        label: '\\n',
        line_breaks: true,
    },
    {
        name: 'linecomment',
        pattern: /\/\/[^\r\n]*/,
        label: '\\\\',
        line_breaks: false,
    },
    {
        name: 'comma',
        pattern: /,/,
        start_chars_hint: [','],
        label: ',',
        line_breaks: false,
    },
    {
        name: 'type',
        pattern: /type/,
        start_chars_hint: ['t'],
        line_breaks: false,
    },
    {
        name: 'extends',
        pattern: /extends/,
        start_chars_hint: ['e'],
        line_breaks: false,
    },
    {
        name: 'constant',
        pattern: /constant/,
        start_chars_hint: ['c'],
        line_breaks: false,
    },
    {
        name: 'native',
        pattern: /native/,
        start_chars_hint: ['n'],
        line_breaks: false,
    },
    {
        name: 'takes',
        pattern: /takes/,
        start_chars_hint: ['t'],
        line_breaks: false,
    },
    {
        name: 'nothing',
        pattern: /nothing/,
        start_chars_hint: ['n'],
        line_breaks: false,
    },
    {
        name: 'returns',
        pattern: /returns/,
        start_chars_hint: ['r'],
        line_breaks: false,
    },
    {
        name: 'identifier',
        pattern: /[a-zA-Z][a-zA-Z0-9_]*/
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

/** @type {Object.<string , import('chevrotain').TokenType>} */
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