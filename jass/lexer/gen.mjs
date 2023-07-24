import {Lexer} from "chevrotain";
import fs from "fs";

const tab = ' '.repeat(4);
const writeTokenMap = (text, flag = 'a+') => fs.writeFileSync('jass-token-map.mjs', text, {flag: flag});
const writeTokenList = (text, flag = 'a+') => fs.writeFileSync('jass-token-list.mjs', text, {flag: flag});
const writeLegendMap = (text, flag = 'a+') => fs.writeFileSync('jass-token-legend.mjs', text, {flag: flag});
const writeLegendList = (text, flag = 'a+') => fs.writeFileSync('jass-semantic-tokens-legend.mjs', text, {flag: flag});

/** @type {(import('chevrotain').ITokenConfig & {color:  string})[]} */
const keywordList = [];
for (let [keyword, color] of Object.entries({
    and: null,
    array: null,
    call: null,
    constant: null,
    debug: null,
    else: null,
    elseif: null,
    endfunction: null,
    endglobals: null,
    endif: null,
    endloop: null,
    exitwhen: null,
    extends: null,
    function: null,
    globals: null,
    if: null,
    local: null,
    loop: null,
    native: null,
    not: null,
    nothing: null,
    or: null,
    returns: null,
    return: null,
    set: null,
    takes: null,
    then: null,
    type: null,
})) keywordList.push({
    name: keyword,
    pattern: new RegExp(`\\b${keyword}\\b`),
    start_chars_hint: [keyword[0]],
    line_breaks: false,
    color: color ??= '#2C7AD6',
});

const numberColor = '#e760cc';
const operatorColor = '#e7be60';
const parenColor = '#e1d132';

/** @type {(import('chevrotain').ITokenConfig & {color:  string})[]} */
const tokenList = [
    {
        name: 'whitespace',
        pattern: /[^\S\r\n]+/,
        line_breaks: false,
        group: Lexer.SKIPPED,
    },
    {
        name: 'comment',
        pattern: /\/\/[^\r\n]*/,
        line_breaks: false,
        color: '#308030'
    },
    ...keywordList,
    // someone
    {
        name: 'comma',
        pattern: /,/,
        start_chars_hint: [','],
        label: ',',
        line_breaks: false,
        color: '#FFFFFF',
    },
    {
        name: 'equals',
        pattern: /==/,
        start_chars_hint: ['='],
        line_breaks: false,
        label: '==',
        color: operatorColor,
    },
    {
        name: 'assign',
        pattern: /=/,
        start_chars_hint: ['='],
        line_breaks: false,
        label: '=',
        color: operatorColor,
    },
    {
        name: 'notequals',
        pattern: /!=/,
        start_chars_hint: ['!'],
        line_breaks: false,
        label: '!=',
        color: operatorColor,
    },
    {
        name: 'lessorequal',
        pattern: /<=/,
        start_chars_hint: ['<'],
        line_breaks: false,
        label: '<=',
        color: operatorColor,
    },
    {
        name: 'less',
        pattern: /</,
        start_chars_hint: ['<'],
        line_breaks: false,
        label: '<',
        color: operatorColor,
    },
    {
        name: 'greatorequal',
        pattern: />=/,
        start_chars_hint: ['>'],
        line_breaks: false,
        label: '>=',
        color: operatorColor,
    },
    {
        name: 'great',
        pattern: />/,
        start_chars_hint: ['>'],
        line_breaks: false,
        label: '>',
        color: operatorColor,
    },
    {
        name: 'add',
        pattern: /\+/,
        start_chars_hint: ['+'],
        line_breaks: false,
        label: '+',
        color: operatorColor,
    },
    {
        name: 'sub',
        pattern: /-/,
        start_chars_hint: ['-'],
        line_breaks: false,
        label: '-',
        color: operatorColor,
    },
    {
        name: 'mult',
        pattern: /\*/,
        start_chars_hint: ['*'],
        line_breaks: false,
        label: '*',
        color: operatorColor,
    },
    {
        name: 'div',
        pattern: /\//,
        start_chars_hint: ['/'],
        line_breaks: false,
        label: '/',
        color: operatorColor,
    },
    {
        name: 'lparen',
        pattern: /\(/,
        start_chars_hint: ['('],
        line_breaks: false,
        label: '(',
        color: parenColor,
    },
    {
        name: 'rparen',
        pattern: /\)/,
        start_chars_hint: [')'],
        line_breaks: false,
        label: ')',
        color: parenColor,
    },
    {
        name: 'lsquareparen',
        pattern: /\[/,
        start_chars_hint: ['['],
        line_breaks: false,
        label: '[',
        color: parenColor,
    },
    {
        name: 'rsquareparen',
        pattern: /]/,
        start_chars_hint: [']'],
        line_breaks: false,
        label: ']',
        color: parenColor,
    },
    // no start_chars_hint
    {
        name: 'real',
        pattern: /\d+\.\d*|\.\d+/,
        line_breaks: false,
        color: numberColor,
    },
    {
        name: 'integer',
        pattern: /\b(?:0x[0-9a-z]+|\$[0-9a-z]+|\d+)\b/i,
        line_breaks: false,
        color: numberColor,
    },
    {
        name: 'linebreak',
        pattern: /\n|\r\n/,
        label: '\\n',
        line_breaks: true,
    },
    {
        name: 'idliteral',
        pattern: /'[^']*'/,
        line_breaks: true,
        color: numberColor,
    },
    {
        name: 'stringliteral',
        pattern: /"[^"\\]*(?:\\.[^"\\]*)*"/,
        start_chars_hint: ['"'],
        line_breaks: true,
        color: '#CE9178',
    },
    {
        name: 'identifier',
        pattern: /[a-zA-Z][a-zA-Z0-9_]*/,
        line_breaks: false,
    },
]

writeTokenMap(`import {createToken, Lexer} from 'chevrotain';

export default {
`, 'w+');

/** @type {Object.<string, string>} */
let legendMap = {};

const nameList = [];

for (const c of tokenList) {
    nameList.push(c.name);

    if (c.color) legendMap[`jass_${c.name}`] = c.color;

    writeTokenMap(`${tab}${c.name}: createToken({\n`);
    for (const [k, v] of Object.entries(c)) {
        if (k === 'color') continue;

        writeTokenMap(`${tab.repeat(2)}${k}: `);
        switch (k) {
            case 'name':
                writeTokenMap(`'${c.name}'`);
                break;
            case 'pattern':
                writeTokenMap(`${v}`);
                break;
            default:
                writeTokenMap(v === Lexer.SKIPPED ? 'Lexer.SKIPPED' : `${JSON.stringify(v)}`);
        }
        writeTokenMap(`,\n`);
    }

    writeTokenMap(`${tab}}),\n`);
}
writeTokenMap(`}\n`);

writeTokenList(`import JassTokenMap from "./jass-token-map.mjs";

export default [${nameList.map(s => `JassTokenMap.${s}`).join(', ')}];`, 'w+');

// =======  legend
const packagePath = '../../package.json';

/** @type {{}} */
const json = JSON.parse(fs.readFileSync(packagePath, {encoding: 'utf8'}));

const contributes = json['contributes'];
const semanticTokenColorCustomizations = contributes['configurationDefaults']['editor.semanticTokenColorCustomizations'];

semanticTokenColorCustomizations.rules = {};
contributes['semanticTokenTypes'] = [];

const legendList = []
writeLegendMap(`export default {\n`, 'w+');

legendMap = {
    ...legendMap, ...{
        jass_variable: '#94d564',
        jass_function_user: '#DCDCAA',
        jass_function_native: '#C586C0',
        jass_type_name: '#4EC9B0',
        jass_argument: '#9CDCDA',
    }
}

for (const [name, color] of Object.entries(legendMap)) {
    semanticTokenColorCustomizations.rules[name] = color;
    contributes['semanticTokenTypes'].push({
        id: name,
        description: '',
    });
    writeLegendMap(`${tab}${name}: ${legendList.length},\n`);
    legendList.push(name);
}
writeLegendMap('}');

writeLegendList(`// noinspection NpmUsedModulesInstalled
import {SemanticTokensLegend} from "vscode";

export default new SemanticTokensLegend([${legendList.map(s => `'${s}'`).join(', ')}], []);`, 'w+');

fs.writeFileSync(packagePath, JSON.stringify(json, null, 2), {flag: 'w+'});
