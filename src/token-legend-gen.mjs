import fs from 'fs';

/**
 * @typedef SemanticTokenRuleJson
 * @prop {string} id
 * @prop {string} description
 * @prop {string} color
 */

/**
 *
 * @type {SemanticTokenRuleJson[]}
 */
const ruledef = [
    {
        id: 'jass_linecomment',
        description: 'jass_linecomment',
        color: '#308030'
    },
    {
        id: 'jass_typedef_comment',
        description: 'jass_typedef_comment',
        color: '#608030',
    },
    {
        id: 'jass_type',
        description: 'jass_type',
        color: '#28edcf',
    },
    {
        id: 'jass_type_keyword',
        description: 'jass_type_keyword',
        color: '#d3acf6',
    },
    {
        id: 'jass_extends_keyword',
        description: 'jass_extends_keyword',
        color: '#d3acf6',

    },
    {
        id: 'jass_constant_keyword',
        description: 'jass_constant_keyword',
        color: '#05ef09',
    },
    {
        id: 'jass_native_keyword',
        description: 'jass_native_keyword',
        color: '#bb73ff',
    },
    {
        id: 'jass_function',
        description: 'jass_function',
        color: '#f5ec70',
    },
    {
        id: 'jass_takes_keyword',
        description: 'jass_takes_keyword',
        color: '#8b78f8',
    },
    {
        id: 'jass_argument',
        description: 'jass_argument',
        color: '#d4dd27',
    },
    {
        id: 'jass_comma',
        description: 'jass_comma',
        color: '#868681',
    },
    {
        id: 'jass_returns_keyword',
        description: 'jass_returns_keyword',
        color: '#8e73ca',
    }
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
    semanticTokenColorCustomizations.rules[rule.id] = rule.color;
    delete rule.color;
    contributes['semanticTokenTypes'].push(rule);

    fs.writeFileSync(legendPath, `${tab}${rule.id}: ${legendList.length},\n`, {flag: 'a+'});
    legendList.push(rule.id);
}

fs.writeFileSync(legendPath, `}\nexport const TokenLegendList = [${legendList.map(s => `'${s}'`).join(', ')}]`, {flag: 'a+'});

fs.writeFileSync(packagePath, JSON.stringify(json, null, 2), {flag: 'w+'});