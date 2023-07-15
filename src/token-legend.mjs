export const TokenLegend = {
    jass_linecomment: 0,
    jass_typedef_comment: 0,
    jass_type: 0,
    jass_type_keyword: 0,
    jass_extends_keyword: 0,
    jass_constant_keyword: 0,
    jass_native_keyword: 0,
    jass_function: 0,
    jass_takes_keyword: 0,
    jass_argument: 0,
    jass_comma: 0,
    jass_returns_keyword: 0,
}
export const TokenLegendList = [];

for (const k of Object.keys(TokenLegend)) {
    TokenLegend[k] = TokenLegendList.length;
    TokenLegendList.push(k);
}
