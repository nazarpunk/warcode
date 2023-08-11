"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chevrotain_1 = require("chevrotain");
const jass_tokens_list_1 = require("../src/jass/jass-tokens-list");
const jass_parser_1 = require("../src/jass/jass-parser");
const jass_visitor_docs_1 = require("../src/jass/jass-visitor-docs");
const parser = new jass_parser_1.default({
    recoveryEnabled: true,
    nodeLocationTracking: 'onlyOffset',
    skipValidations: false,
});
const iframe = document.createElement('iframe');
iframe.src = 'data:text/html;charset=utf-8,' + encodeURI((0, chevrotain_1.createSyntaxDiagramsCode)(parser.getSerializedGastProductions()));
document.body.appendChild(iframe);
(async () => {
    const request = await fetch('test.txt');
    const text = await request.text();
    const lexer = new chevrotain_1.Lexer(jass_tokens_list_1.default, {
        recoveryEnabled: true,
        positionTracking: 'onlyOffset',
        deferDefinitionErrorsHandling: true,
        ensureOptimizations: true,
    });
    const result = lexer.tokenize(text);
    parser.input = result.tokens;
    const nodes = parser["jass" /* JassRule.jass */]();
    for (const error of parser.errors)
        console.error(error);
    const visitor = new jass_visitor_docs_1.default();
    visitor.visit(nodes);
})();
//# sourceMappingURL=main.js.map