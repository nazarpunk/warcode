"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jass_tokens_1 = require("../../src/jass/jass-tokens");
const zinc_tokens_1 = require("../../src/zinc/zinc-tokens");
const wts_tokens_1 = require("../../src/wts/wts-tokens");
const fs = require("fs");
const legendMap = {
    ...jass_tokens_1.JassColors,
    ...wts_tokens_1.WtsColors,
    ...zinc_tokens_1.ZincColors
};
const root = '../..';
const packagePath = `${root}/package.json`;
const writeLegendMap = (text, flag = 'a+') => fs.writeFileSync(`${root}/src/semantic/token-legend.ts`, text, { flag: flag });
const writeLegendList = (text, flag = 'a+') => fs.writeFileSync(`${root}/src/semantic/ext-semantic-tokens-legend.ts`, text, { flag: flag });
const tab = ' '.repeat(4);
const json = JSON.parse(fs.readFileSync(packagePath, { encoding: 'utf8' }));
const contributes = json['contributes'];
const semanticTokenColorCustomizations = contributes['configurationDefaults']['editor.semanticTokenColorCustomizations'];
semanticTokenColorCustomizations.rules = {};
contributes['semanticTokenTypes'] = [];
const legendList = [];
writeLegendMap('const enum TokenLegend {\n', 'w+');
for (const [name, color] of Object.entries(legendMap)) {
    semanticTokenColorCustomizations.rules[name] = color;
    contributes['semanticTokenTypes'].push({
        id: name,
        description: '',
    });
    writeLegendMap(`${tab}${name} = ${legendList.length},\n`);
    legendList.push(name);
}
writeLegendMap('}\n export default TokenLegend');
writeLegendList(`import {SemanticTokensLegend} from 'vscode'

export default new SemanticTokensLegend([${legendList.map(s => `'${s}'`).join(', ')}], [])`, 'w+');
fs.writeFileSync(packagePath, JSON.stringify(json, null, 2), { flag: 'w+' });
//# sourceMappingURL=gen.js.map