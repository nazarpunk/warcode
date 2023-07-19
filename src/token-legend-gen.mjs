import fs from 'fs';

/**
 * @typedef SemanticTokenRuleJson
 * @prop {string} id
 * @prop {string} description
 * @prop {string} color
 */

const keyword = '#2C7AD6';

// noinspection JSValidateTypes
/** @type {SemanticTokenRuleJson[]} */
const ruledef = [
    {
        id: 'jass_comment',
        color: '#308030'
    },
    {
        id: 'jass_type',
        color: '#4EC9B0',
    },
    {
        id: 'jass_function',
        color: '#DCDCAA',
    },
    {
        id: 'jass_function_native',
        color: '#C586C0',
    },
    {
        id: 'jass_argument',
        color: '#9CDCDA',
    },
    {
        id: 'jass_comma',
        color: '#FFFFFF',
    },
    {
        id: 'jass_variable',
        color: '#94d564',
    },
    // keyword
    {
        id: 'jass_type_keyword',
        color: keyword,
    },
    {
        id: 'jass_local_keyword',
        color: keyword,
    },
    {
        id: 'jass_extends_keyword',
        color: keyword,
    },
    {
        id: 'jass_constant_keyword',
        color: keyword,
    },
    {
        id: 'jass_native_keyword',
        color: keyword,
    },
    {
        id: 'jass_function_keyword',
        color: keyword,
    },
    {
        id: 'jass_endfunction_keyword',
        color: keyword,
    },
    {
        id: 'jass_takes_keyword',
        color: keyword,
    },
    {
        id: 'jass_returns_keyword',
        color: keyword,
    },
];

const packagePath = '../package.json';
const tab = '    ';

/** @type {{}} */
const json = JSON.parse(fs.readFileSync(packagePath, {encoding: 'utf8'}));

const contributes = json['contributes'];
const semanticTokenColorCustomizations = contributes['configurationDefaults']['editor.semanticTokenColorCustomizations'];

semanticTokenColorCustomizations.rules = {};
contributes['semanticTokenTypes'] = [];

const legendPath = 'token-legend.mjs';
const legendList = []

fs.writeFileSync(legendPath, `export const TokenLegend = {\n`, {flag: 'w+'});
for (const rule of ruledef) {
    rule.description ??= rule.id;

    semanticTokenColorCustomizations.rules[rule.id] = rule.color;
    delete rule.color;
    contributes['semanticTokenTypes'].push(rule);

    fs.writeFileSync(legendPath, `${tab}${rule.id}: ${legendList.length},\n`, {flag: 'a+'});
    legendList.push(rule.id);
}

fs.writeFileSync(legendPath, `}\nexport const TokenLegendList = [${legendList.map(s => `'${s}'`).join(', ')}]`, {flag: 'a+'});

fs.writeFileSync(packagePath, JSON.stringify(json, null, 2), {flag: 'w+'});