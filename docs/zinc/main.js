"use strict";
// noinspection DuplicatedCode
Object.defineProperty(exports, "__esModule", { value: true });
const chevrotain_1 = require("chevrotain");
const zinc_parser_1 = require("../../src/zinc/zinc-parser");
const zinc_tokens_list_1 = require("../../src/zinc/zinc-tokens-list");
const zinc_visitor_docs_1 = require("../../src/zinc/zinc-visitor-docs");
const parser = new zinc_parser_1.default();
const iframe = document.createElement('iframe');
iframe.src = 'data:text/html;charset=utf-8,' + encodeURI((0, chevrotain_1.createSyntaxDiagramsCode)(parser.getSerializedGastProductions()));
document.body.appendChild(iframe);
(async () => {
    const request = await fetch('test.txt');
    const text = await request.text();
    const lexer = new chevrotain_1.Lexer(zinc_tokens_list_1.default, {
        recoveryEnabled: true,
        positionTracking: 'onlyOffset',
        deferDefinitionErrorsHandling: true,
        ensureOptimizations: true,
    });
    const result = lexer.tokenize(text);
    parser.input = result.tokens;
    const nodes = parser["zinc" /* ZincRule.zinc */]();
    const visitor = new zinc_visitor_docs_1.default();
    visitor.visit(nodes);
})();
//# sourceMappingURL=main.js.map